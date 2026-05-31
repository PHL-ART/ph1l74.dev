#!/usr/bin/env bash
set -euo pipefail

# Устанавливает CORS-правила на S3-бакет ph1l74-dev.
# Нужно запустить один раз после деплоя.
#
# Запуск:
#   bash scripts/setup-s3-cors.sh
#
# Требует: aws-cli v2

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="$SCRIPT_DIR/../.env"

# Загружаем .env если он есть
if [[ -f "$ENV_FILE" ]]; then
  set -o allexport
  # shellcheck disable=SC1090
  source "$ENV_FILE"
  set +o allexport
fi

# Проверяем наличие переменных
for var in S3_ENDPOINT S3_BUCKET S3_REGION S3_ACCESS_KEY S3_SECRET_KEY; do
  if [[ -z "${!var:-}" ]]; then
    echo "✗ Отсутствует переменная окружения: $var" >&2
    exit 1
  fi
done

CORS_JSON='{
  "CORSRules": [
    {
      "AllowedOrigins": ["*"],
      "AllowedMethods": ["GET", "PUT", "HEAD"],
      "AllowedHeaders": ["*"],
      "MaxAgeSeconds": 3000
    }
  ]
}'

echo "Применяем CORS на бакет: $S3_BUCKET"

AWS_ACCESS_KEY_ID="$S3_ACCESS_KEY" \
AWS_SECRET_ACCESS_KEY="$S3_SECRET_KEY" \
aws s3api put-bucket-cors \
  --endpoint-url "$S3_ENDPOINT" \
  --region "$S3_REGION" \
  --bucket "$S3_BUCKET" \
  --cors-configuration "$CORS_JSON"

echo "✓ CORS-правила применены"
echo "✓ Проверка — текущий конфиг:"

AWS_ACCESS_KEY_ID="$S3_ACCESS_KEY" \
AWS_SECRET_ACCESS_KEY="$S3_SECRET_KEY" \
aws s3api get-bucket-cors \
  --endpoint-url "$S3_ENDPOINT" \
  --region "$S3_REGION" \
  --bucket "$S3_BUCKET"
