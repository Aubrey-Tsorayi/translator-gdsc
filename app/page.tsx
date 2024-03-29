"use client";

import { useEffect, useState } from "react";
import { analytics } from "@/firebase/firebase";
import { logEvent } from "firebase/analytics";
import Card from "@/components/Card";
import Image from "next/image";
import query from "@/api/translationApi";
import { History } from "@/types/historyTypes";

export default function Home() {
  // states
  const [lang, setLang] = useState("");
  const [english, setEnglish] = useState("");
  const [loading, setLoading] = useState(false);

  // handling page erros
  const [errors, setErrors] = useState("");
  const [empty, setEmpty] = useState(false);
  const [same, setSame] = useState(false); // can't translate same langauage

  // handle selecting of languages
  const [language, setLanguage] = useState("English"); // default is english
  const [translation, setTranslation] = useState("Kirundi"); // default kirundi

  const checkTranslationLanguage = () => {
    if (
      language.toLowerCase() === "english" &&
      translation.toLowerCase() === "kirundi"
    ) {
      return "en-rn";
    } else if (
      language.toLowerCase() === "kirundi" &&
      translation.toLowerCase() === "english"
    ) {
      return "rn-en";
    } else {
      setSame(true);
      return "";
    }
  };

  // logging page vists
  useEffect(() => {
    logEvent(analytics, "page_visit");
  }, []);

  const [history, setHistory] = useState<History[]>([]);

  const translate = async (e: React.FormEvent) => {
    setLoading(true);
    e.preventDefault();
    if (english === "") {
      setEmpty(true);
      setLoading(false);
    } else if (checkTranslationLanguage() === "") {
      setSame(true);
      //setEmpty(false)
      setLoading(false);
    } else {
      setEmpty(false);
      setSame(false);
      query({ inputs: english }, checkTranslationLanguage())
        .then((response) => {
          setLoading(false);
          setLang(response[0].generated_text);
          setHistory((prevHistory) => [
            ...prevHistory,
            { english: english, lang: response[0].generated_text },
          ]);
          logEvent(analytics, "translation_completed");
        })
        .catch((error) => {
          setLoading(false);
          setErrors("Error occured" + error);
          logEvent(analytics, "server_down");
        });
    }
  };

  const handleEnglishChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEnglish(e.target.value.toLowerCase());
  };

  return (
    <div className="flex flex-col w-full items-center p-10">
      {/* heading start */}
      <div className="flex justify-center gap-5">
        <div className="flex flex-col items-center w-full">
          <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold">
            Translate <span className="text-red-600">Africa</span>
          </h1>
          <h1 className="font-bold text-sm md:text-lg lg:text-2xl text-gray-700">
            Google Solution Challenge 2024
          </h1>
        </div>
        <div>
          <Image src="/assets/logo.png" width={75} height={75} alt="" />
        </div>
      </div>
      {/* heading end */}

      {/* project start */}
      <div className="lg:w-[600px] text-center mt-5 text-wrap mb-5">
        <article>
          This is a Translator application developed by the Google Developers
          Student Club at Africa University for the Google Solution Challenge
          2024. This project aims to provide an efficient and user-friendly
          translation tool using state-of-the-art natural language processing
          models
        </article>
      </div>
      <a
        href="https://github.com/Aubrey-Tsorayi/translator-gdsc/tree/main"
        target="_blank"
      >
        <Image
          src="/assets/github.png"
          width={75}
          height={75}
          className="scale-75"
          alt=""
        />
      </a>
      {/* project end */}

      {/* Translation start */}
      <div className="flex items-start mt-10">
        <div className="flex flex-col md:flex-row lg:flex-row gap-5">
          <div className="flex flex-col items-start">
            <select
              className="bg-red-600 py-3 px-5 rounded-xl text-white"
              value={language}
              onChange={(e) => {
                setLanguage(e.target.value);
              }}
            >
              <option value="English">English</option>
              <option value="Kirundi">Kirundi</option>
            </select>
            <form className="mt-5">
              <textarea
                name="english"
                id="english"
                cols={30}
                rows={10}
                placeholder="Enter text to translate"
                className=" w-full p-5 rounded-xl bg-gray-300"
                onChange={handleEnglishChange}
              ></textarea>
              {errors && (
                <div className="text-red-500">
                  <span>Server was done try again</span>
                </div>
              )}
              {empty && (
                <div className="text-red-500">
                  <span>Please enter some text</span>
                </div>
              )}
              {same && (
                <div className="text-red-500">
                  <span>Can not translate to the same langauage</span>
                </div>
              )}
            </form>
          </div>
          <div className="flex justify-center items-center">
            <button
              className="md:absolute lg:absolute bg-red-600 py-4 flex items-center gap-1 text-white px-5 rounded-lg h-fit"
              onClick={translate}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="white"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
                />
              </svg>
              <p className="text-sm">Translate</p>
            </button>
          </div>
          <div className="flex flex-col items-start">
            <select
              className="bg-red-600 py-3 px-5 rounded-xl text-white"
              value={translation}
              onChange={(e) => {
                setTranslation(e.target.value);
              }}
            >
              <option value="Kirundi">Kirundi</option>
              <option value="English">English</option>
            </select>
            <form className="mt-5">
              <textarea
                name="lang"
                id="lang"
                cols={30}
                rows={10}
                placeholder="Translation will appear here"
                value={loading === true ? "Translating..." : lang}
                className=" w-full p-5 rounded-xl bg-gray-300"
                readOnly
              ></textarea>
            </form>
          </div>
        </div>
      </div>
      {/* Translation end */}

      {/* history start */}
      <div className="flex flex-col items-start lg:w-[640px] mt-10">
        <h1 className="font-bold text-xl underline p-2 ">History</h1>
        <div className="flex flex-col md:grid md:grid-cols-2 lg:grid lg:grid-cols-2 p-2 gap-7">
          {history.map((item, index) => (
            <Card
              lang={item.lang}
              english={item.english}
              language={language}
              translation={translation}
              key={index}
            />
          ))}
        </div>
      </div>
      {/* history end */}
      <a href="#" className="fixed bottom-10 right-10 bg-red-600 p-2 text-white rounded-lg animate-bounce">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18"
          />
        </svg>
      </a>
    </div>
  );
}
