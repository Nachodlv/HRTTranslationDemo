ibmcloud fn action update hrt-demo/detect-language --docker ibmarc/cloud-functions-ai-translator:v1 src/detect-language.js --param-file config/ai-params.json --web true

ibmcloud fn action update hrt-demo/translate --docker ibmarc/cloud-functions-ai-translator:latest src/translate.js -P config/ai-params.json --web true

ibmcloud fn action update hrt-demo/identify-and-translate --sequence hrt-demo/detect-language,hrt-demo/translate --web true
