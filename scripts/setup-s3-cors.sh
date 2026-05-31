HOST="${S3_ENDPOINT#https://}"
HOST="${HOST#http://}"

# Вытаскиваем самоподписанный CA-сертификат firstvds и сохраняем во временный файл.
# Это безопаснее, чем --no-verify-ssl: мы проверяем именно этот сертификат,
# а не отключаем TLS-проверку полностью.
CA_BUNDLE="$(mktemp /tmp/firstvds-ca.XXXXXX.pem)"
trap 'rm -f "$CA_BUNDLE"' EXIT

echo "Получаем сертификат $HOST..."
openssl s_client -connect "${HOST}:443" -showcerts 2>/dev/null \
  | awk '/BEGIN CERTIFICATE/,/END CERTIFICATE/' > "$CA_BUNDLE"

if [[ ! -s "$CA_BUNDLE" ]]; then
  echo "✗ Не удалось получить сертификат от $HOST" >&2
  exit 1
fi
echo "✓ Сертификат сохранён во временный файл"

echo "Применяем CORS на бакет: $S3_BUCKET"

AWS_ACCESS_KEY_ID="$S3_ACCESS_KEY" \
AWS_SECRET_ACCESS_KEY="$S3_SECRET_KEY" \
AWS_CA_BUNDLE="$CA_BUNDLE" \
aws s3api put-bucket-cors \
  --endpoint-url "$S3_ENDPOINT" \
  --region "$S3_REGION" \
  --bucket "$S3_BUCKET" \
  --cors-configuration "$CORS_JSON"

echo "✓ CORS-правила применены"
echo "✓ Проверка — текущий конфиг:"

AWS_ACCESS_KEY_ID="$S3_ACCESS_KEY" \
AWS_SECRET_ACCESS_KEY="$S3_SECRET_KEY" \
AWS_CA_BUNDLE="$CA_BUNDLE" \
aws s3api get-bucket-cors \
  --endpoint-url "$S3_ENDPOINT" \
  --region "$S3_REGION" \
  --bucket "$S3_BUCKET"