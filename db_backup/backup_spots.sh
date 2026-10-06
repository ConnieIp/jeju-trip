#!/bin/bash
# Load environment variables
export $(grep -v '^#' /Users/connie/workspace/jeju-trip/trip/.env.local | xargs)

# Create backup directory if it doesn't exist
mkdir -p /Users/connie/workspace/jeju-trip/db_backup

# Backup filename with timestamp
BACKUP_FILE="/Users/connie/workspace/jeju-trip/db_backup/spots_$(date +%Y-%m-%d_%H-%M-%S).json"

# Backup the spots table
curl -s -X GET "${VITE_SUPABASE_URL}/rest/v1/spots?select=*" \
  -H "apikey: ${SUPABASE_SERVICE_ROLE_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_SERVICE_ROLE_KEY}" \
  > "$BACKUP_FILE"

echo "Backup created: $BACKUP_FILE"
