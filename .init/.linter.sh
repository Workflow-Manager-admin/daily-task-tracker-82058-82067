#!/bin/bash
cd /home/kavia/workspace/code-generation/daily-task-tracker-82058-82067/todo_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

