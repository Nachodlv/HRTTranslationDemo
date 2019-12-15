const LanguageTranslatorV3 = require('ibm-watson/language-translator/v3');
const { IamAuthenticator } = require('ibm-watson/auth');
const languageTranslator = new LanguageTranslatorV3({
  version: '2018-05-01',
  authenticator: new IamAuthenticator({
    apikey: 'EUcqUJpowxolnh8cIeAfEp8WZ38FXukAmG5ZDTrGdaJd',
  }),
  url: 'https://gateway-fra.watsonplatform.net/language-translator/api',
});
const preferedLanguage = 'en';

/**
 * Helper 
 * @param {*} errorMessage 
 * @param {*} defaultLanguage 
 */
function getTheErrorResponse(errorMessage, defaultLanguage) {
  return {
    statusCode: 200,
    body: {
      language: defaultLanguage || preferedLanguage,
      errorMessage: errorMessage
    }
  };
}

/**
  *
  * main() will be run when teh action is invoked
  *
  * @param Cloud Functions actions accept a single parameter, which must be a JSON object.
  *
  * @return The output of this action, which must be a JSON object.
  *
  */
function main(params) {

  /*
   * The default language to choose in case of an error
   */
  const defaultLanguage = 'en';

  return new Promise(function (resolve, reject) {

    try {

      if(params.body.language === preferedLanguage) {
        sendBody(resolve, {
            translations: params.body.text,
            words: params.body.text.split(' ').length,
            characters: params.body.text.length
          });
        return;
      }

      const translateParams = {
        text: params.body.text,
        modelId: params.body.language + '-' + preferedLanguage,
      };

      languageTranslator.translate(translateParams)
        .then(translationResult => {
          const res = translationResult.result;
          sendBody(resolve, {
              translations: res.translations[0].translation,
              words: res.word_count,
              characters: res.character_count,
            });
        }).catch(err => {
          console.error('Error while translating the text', err);
          resolve(getTheErrorResponse(JSON.stringify(params), defaultLanguage));
        });
         
    } catch (err) {
      console.error('Error while initializing the AI service', err);
      resolve(getTheErrorResponse('Error while communicating with the language service', defaultLanguage));
    }
  });
}

function sendBody(resolve, body) {
  resolve({
    statusCode: 200,
    body,
    headers: { 'Content-Type': 'application/json' }
  })
}
