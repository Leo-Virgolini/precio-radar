#!/bin/bash
# =============================================================
# Script para crear instancia Oracle Cloud Free Tier (ARM A1)
# Reintenta automáticamente hasta conseguir capacidad
# =============================================================

# ─── CONFIGURACIÓN (completar con tus datos) ─────────────────
COMPARTMENT_ID="ocid1.tenancy.oc1..TU_COMPARTMENT_ID"
SUBNET_ID="ocid1.subnet.oc1..TU_SUBNET_ID"
IMAGE_ID="ocid1.image.oc1..TU_IMAGE_ID"
SSH_KEY_FILE="$HOME/.ssh/id_rsa.pub"
AVAILABILITY_DOMAIN="AD-1"  # Probar con AD-1, AD-2, AD-3

# Configuración de la instancia
INSTANCE_NAME="precioradar-server"
SHAPE="VM.Standard.A1.Flex"
OCPUS=1
MEMORY_GB=6
BOOT_VOLUME_GB=47

# Intervalo entre reintentos (en segundos)
RETRY_INTERVAL=60
# ──────────────────────────────────────────────────────────────

# Cloud-init script (configuración automática del servidor)
CLOUD_INIT=$(cat <<'CLOUDINIT'
#!/bin/bash
apt-get update && apt-get upgrade -y
apt-get install -y nginx certbot python3-certbot-nginx

# Node.js 22 LTS
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt-get install -y nodejs
npm install -g pm2

# Java 21 (para Spring Boot)
apt-get install -y openjdk-21-jre-headless

# Firewall - abrir puertos 80 y 443
iptables -I INPUT 6 -m state --state NEW -p tcp --dport 80 -j ACCEPT
iptables -I INPUT 6 -m state --state NEW -p tcp --dport 443 -j ACCEPT
netfilter-persistent save
CLOUDINIT
)

# Guardar cloud-init en archivo temporal
CLOUD_INIT_FILE=$(mktemp /tmp/cloud-init-XXXXX.sh)
echo "$CLOUD_INIT" > "$CLOUD_INIT_FILE"

echo "============================================"
echo " Oracle Cloud - Creador de instancia A1"
echo "============================================"
echo " Shape:    $SHAPE ($OCPUS OCPU, ${MEMORY_GB}GB RAM)"
echo " AD:       $AVAILABILITY_DOMAIN"
echo " Reintento cada: ${RETRY_INTERVAL}s"
echo "============================================"
echo ""

ATTEMPT=0

while true; do
  ATTEMPT=$((ATTEMPT + 1))
  TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
  echo "[$TIMESTAMP] Intento #$ATTEMPT..."

  RESULT=$(oci compute instance launch \
    --compartment-id "$COMPARTMENT_ID" \
    --availability-domain "$AVAILABILITY_DOMAIN" \
    --shape "$SHAPE" \
    --shape-config "{\"ocpus\": $OCPUS, \"memoryInGBs\": $MEMORY_GB}" \
    --image-id "$IMAGE_ID" \
    --subnet-id "$SUBNET_ID" \
    --assign-public-ip true \
    --display-name "$INSTANCE_NAME" \
    --ssh-authorized-keys-file "$SSH_KEY_FILE" \
    --boot-volume-size-in-gbs "$BOOT_VOLUME_GB" \
    --user-data-file "$CLOUD_INIT_FILE" \
    2>&1)

  if echo "$RESULT" | grep -q '"lifecycle-state"'; then
    echo ""
    echo "============================================"
    echo " ¡INSTANCIA CREADA EXITOSAMENTE!"
    echo "============================================"
    echo "$RESULT" | grep -E '"id"|"display-name"|"lifecycle-state"|"public-ip"'
    echo ""
    echo "Esperá unos minutos a que termine el cloud-init."
    echo "Conectate con: ssh ubuntu@<IP_PUBLICA>"
    rm -f "$CLOUD_INIT_FILE"
    exit 0
  fi

  if echo "$RESULT" | grep -qi "out of capacity"; then
    echo "  → Sin capacidad. Reintentando en ${RETRY_INTERVAL}s..."
  else
    echo "  → Error: $(echo "$RESULT" | head -3)"
    echo "  → Reintentando en ${RETRY_INTERVAL}s..."
  fi

  sleep "$RETRY_INTERVAL"
done
