import { Guesses } from "./Guesses";
import Modal from "react-modal";

interface InfosProps {
  isOpen: boolean;
  close: () => void;
}

export function Infos({ isOpen, close }: InfosProps) {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={close}
      className="flex justify-center h-full"
    >
      <div className="w-full max-w-lg bg-white text-sm overflow-auto px-2">
        <header className="border-b-2 border-gray-200 mb-3 flex">
          <h2 className="text-2xl font-bold uppercase tracking-wide text-center my-1 flex-auto">
            Spillemåte
          </h2>
          <button type="button" onClick={close}>
            ✖️
          </button>
        </header>
        <div className="space-y-3 text-justify border-b-2 border-gray-200 pb-3 mb-3">
          <div>
         Gjett{" "}
            <span className="font-bold">
              KOMMUND<span className="text-green-600">L</span>EN
            </span>{" "}
            på seks gjetninger.
          </div>
          <div>Hver gjetning må være en norsk kommune.</div>
          <div>
            Etter hver gjetning får du vite hvor langt unna du er og hvilken retning den korrekte kommunen ligger relativ til den du har gjetta. 
          </div>
        </div>
        <div className="space-y-3 text-justify border-b-2 border-gray-200 pb-3 mb-3">
          <div className="font-bold">Eksempel</div>
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
            />
            <div className="my-2">
              Din første gjetning <span className="uppercase font-bold">Vadsø</span> er 
              1195km unna riktig kommune, den riktige kommunen ligger sørvestover.
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
            />
            <div className="my-2">
                            Din andre gjetning <span className="uppercase font-bold">Tydal</span> er nærmere og 
              127km unna riktig kommune. Den riktige kommunen ligger vestover.
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
            />
            <div className="my-2">
              Din tredje gjetning, <span className="uppercase font-bold">Rindal</span>,
              er riktig. Gratulerer! 🎉
            </div>
          </div>
        </div>
        <div className="space-y-3 text-justify border-b-2 border-gray-200 pb-3 mb-3 font-bold">
          Det kommer en ny KOMMUND<span className="text-green-600">L</span>E hver dag.
        </div>
        <div className="space-y-3 text-justify border-b-2 border-gray-200 pb-3 mb-3">
          <span className="font-bold">
            KOMMUND<span className="text-green-600">L</span>E
          </span>{" "}
          er inspirert av og baserer seg på kode fra {" "}
          <a
            className="underline"
            href="https://worldle.teuteuf.fr"
            target="_blank"
            rel="noopener noreferrer"
          >
            WORLDLE
          </a>{" "}
          laget og generøst delt av{" "}
          <a
            className="underline"
            href="https://mastodon.social/@teuteuf"
            target="_blank"
            rel="noopener noreferrer"
          >
            @teuteuf@mastodon.social
          </a>
          .
        </div>
        <div className="space-y-3 text-justify pb-3">
          <div>
            KOMMUNDLE er laget av {" "}
            <a
              className="underline"
              href="https://nerdculture.de/@Oyvindbs"
              target="_blank"
              rel="noopener noreferrer"
            >
              Øyvind Solheim
            </a>
            og
            <a
              className="underline"
              href="https://twitter.com/sandrabruce"
              target="_blank"
              rel="noopener noreferrer"
            >
            Sandra Bruce
            </a>
          </div>
          <div>
            <a
              className="underline"
              href="https://www.buymeacoffee.com/oyvindbs"
              target="_blank"
              rel="noopener noreferrer"
            >
              Lyst til å kjøpe oss en kaffe? ☕
            </a>
          </div>
        </div>
      </div>
    </Modal>
  );
}
