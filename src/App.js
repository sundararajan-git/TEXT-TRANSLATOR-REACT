import React, { useState, useEffect } from 'react';
import {
    Form,
    TextArea,
    Button,
    Icon
} from 'semantic-ui-react';
import axios from 'axios';
import "./App.css"

export default function Translate() {
    const [inputText, setInputText] = useState('');
    const [detectLanguageKey, setdetectedLanguageKey] = useState('');
    const [selectedLanguageKey, setLanguageKey] = useState('')
    const [languagesList, setLanguagesList] = useState([])
    const [resultText, setResultText] = useState('');

    const getLanguageSource = async () => {

        let response = await axios.post(`https://libretranslate.de/detect`, { q: inputText })
        let data = response.data[0].language;
        setdetectedLanguageKey(data)

    }

    useEffect(() => {
        axios.get(`https://libretranslate.de/languages`)
            .then((response) => {
                setLanguagesList(response.data)
            })
    }, [])

    const languageKey = (selectedLanguage) => {
        getLanguageSource()
        setLanguageKey(selectedLanguage.target.value)
    }

    const translateText = () => {
        let data = {
            q: inputText,
            source: detectLanguageKey,
            target: selectedLanguageKey,
        }

        axios.post(`https://libretranslate.de/translate`, data).then((response) => {
            setResultText(response.data.translatedText)
        }).catch((err) => {
            console.log(err);
        })
    }


    useEffect(() => {
        axios.get(`https://libretranslate.de/languages`)
            .then((response) => {
                console.log('Language Res[ponse : ' + response);
                setLanguagesList(response.data)
            })

    }, [inputText])

    return (
        <div>
            <div className="app-header">
                <h2 className="header fade-down">Texty Translator</h2>
            </div>

            <div className='app-body'>

                    <select className="language-select fade-down" onChange={languageKey}>
                        <option>Please Select Language..</option>
                        {languagesList.map((language, index) => {
                            return (
                                <option value={language.code} key={index}>
                                    {language.name}
                                </option>
                            )
                        })}
                    </select>

                    <Form className='flex'>

                        <div className='fade-right'>
                            <Form.Field
                                control={TextArea}
                                placeholder='Type Text to Translate..'
                                onChange={(e) => setInputText(e.target.value)}
                            />

                        </div>

                        <div className='fade-left'>

                            <Form.Field
                                control={TextArea}
                                placeholder='Your Result Translation..'
                                value={resultText}
                            />




                        </div>

                    </Form><br />

                    <Button
                        className='fade-up'
                        color="orange"
                        size="large"
                        onClick={translateText}
                    >
                        <Icon name='translate' />
                        Translate</Button>
            </div>
        </div>
    )
}
