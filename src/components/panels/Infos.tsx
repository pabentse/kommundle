import { Guesses } from "../Guesses";
import { Panel } from "./Panel";
import React from "react";
import { Worldle } from "../Worldle";
import { formatDistance } from "../../domain/geography";
import { SettingsData } from "../../hooks/useSettings";

interface InfosProps {
  isOpen: boolean;
  close: () => void;
  settingsData: SettingsData;
}

export function Infos({ isOpen, close, settingsData }: InfosProps) {
  return (
    <Panel title="How to play" isOpen={isOpen} close={close}>
      <div className="space-y-3 text-justify border-b-2 border-gray-200 pb-3 mb-3">
        <div>
          Guess the right painting in 6 tries or less. You can guess by typing
          in the input field.
        </div>
        <div>
          After each guess you will be told how far away you by year, and
          whether you need to guess higher or lower. You are also given a
          percentage that tells you how close you are relative to the range of
          years. More instructions to come.
        </div>
      </div>
      <div className="space-y-3 text-justify border-b-2 border-gray-200 pb-3 mb-3">
        <div className="font-bold">Examples</div>
        <div>
          <Guesses
            rowCount={1}
            guesses={[
              {
                name: "Vadsø",
                direction: "SW",
                distance: 1_195_000,
              },
            ]}
            settingsData={settingsData}
          />
          <div className="my-2">
            Din første gjetning{" "}
            <span className="uppercase font-bold">Vadsø</span> er
            {formatDistance(1195000, settingsData.distanceUnit)} unna riktig
            kommune, den riktige kommunen ligger sørvestover.
          </div>
        </div>
        <div>
          <Guesses
            rowCount={1}
            guesses={[
              {
                name: "Tydal",
                direction: "W",
                distance: 127_000,
              },
            ]}
            settingsData={settingsData}
          />
          <div className="my-2">
            Din andre gjetning{" "}
            <span className="uppercase font-bold">Tydal</span> er nærmere og{" "}
            {formatDistance(127000, settingsData.distanceUnit)} unna riktig
            kommune. Den riktige kommunen ligger vestover.
          </div>
        </div>
        <div>
          <Guesses
            rowCount={1}
            guesses={[
              {
                name: "Rindal",
                direction: "N",
                distance: 0,
              },
            ]}
            settingsData={settingsData}
          />
          <div className="my-2">
            Din tredje gjetning,{" "}
            <span className="uppercase font-bold">Rindal</span>, er riktig.
            Gratulerer! 🎉
          </div>
        </div>
      </div>
      <div className="space-y-3 text-justify border-b-2 border-gray-200 pb-3 mb-3 font-bold">
        Det kommer en ny <Worldle /> hver dag.
      </div>
      <div className="space-y-3 text-justify border-b-2 border-gray-200 pb-3 mb-3">
        <div className="font-bold">Angående avstander</div>
        <div>
          Avstandene som brukes er mellom midtpunkteti hver kommune. Selv
          nabokommuner har dermed mer enn 0 i avstand.
        </div>
      </div>
      <div className="space-y-3 text-justify border-b-2 border-gray-200 pb-3 mb-3">
        <Worldle /> is inspired by and is based on code from{" "}
        <a
          className="underline"
          href="https://worldle.teuteuf.fr"
          target="_blank"
          rel="noopener noreferrer"
        >
          WORLDLE
        </a>{" "}
        made and generously shared by{" "}
        <a
          className="underline"
          href="https://mastodon.social/@teuteuf"
          target="_blank"
          rel="noopener noreferrer"
        >
          @teuteuf@mastodon.social
        </a>
        . Also, a big thanks to Kommundle.no for help and guidance.
      </div>
      <div className="space-y-3 text-justify pb-3">
        <div>
          <Worldle /> is made by Pål Bentsen.
        </div>
        <div>
          <a
            className="underline"
            href="https://ko-fi.com/artle"
            target="_blank"
            rel="noopener noreferrer"
          >
            Do you want to buy me a coffee? ☕
          </a>
        </div>
        <div className="font-bold">DATA</div>
        This game would not have been possible without data made available by
        Kommundle.no, Worldle by teuteuf.fr and Wikipedia.{" "}
      </div>
    </Panel>
  );
}
