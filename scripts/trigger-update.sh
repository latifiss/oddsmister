#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🔄 Triggering predictions update...${NC}"

# Trigger the update
RESPONSE=$(curl -s -X GET https://oddsmister.vercel.app/api/predictions/update \
  -H "User-Agent: Manual-Trigger" \
  --max-time 300)

echo -e "${GREEN}📊 Response:${NC}"
echo $RESPONSE | jq '.'

echo ""
echo -e "${YELLOW}📊 Checking status after update...${NC}"

# Check status
STATUS=$(curl -s https://oddsmister.vercel.app/api/predictions/status)

echo -e "${GREEN}📊 Status:${NC}"
echo $STATUS | jq '.'

# Check if update was successful
if echo $STATUS | grep -q '"status":"fresh"'; then
  echo -e "${GREEN}✅ Update successful! Cache is fresh.${NC}"
else
  echo -e "${RED}❌ Update may have failed. Check logs.${NC}"
fi