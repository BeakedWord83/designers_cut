#!/bin/bash

GADI_MESSAGE=$'ידג םולש
:ץירהל ליבשב דעונ הזה טפירקסה
http://localhost:3000 לע רתאה תא
http://localhost:8080 לע API ה תא
הקידבב ליחתהל ליבשב רתאה תבותכל שולגת השקבב'

echo "$GADI_MESSAGE"

./bash_scripts/site.sh &
./bash_scripts/ai.sh &

wait
echo "finished"


