import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { faker } from "@faker-js/faker";
import Modal from "./components/Modal";
import { BiDownArrowAlt } from "react-icons/bi";
import { IoIosAttach } from "react-icons/io";

function SendImageModal({
  innerref,
  author,
}: {
  innerref: React.RefObject<HTMLDialogElement>;
  author: string;
}) {
  const generateUploadUrl = useMutation(api.messages.generateUploadUrl);
  const sendImage = useMutation(api.messages.sendImage);

  const [image, setImage] = useState<File>();
  const [caption, setCaption] = useState<string>();

  return (
    <Modal
      innerref={innerref}
      title="Send Image"
      onClosed={() => innerref.current?.close()}
    >
      {image && (
        <img
          src={URL.createObjectURL(image)}
          alt=""
          style={{ aspectRatio: 1, maxWidth: "300px" }}
        />
      )}
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (!image) return;
          const postUrl = await generateUploadUrl();

          const result = await fetch(postUrl, {
            method: "POST",
            headers: { "Content-Type": image.type },
            body: image,
          });
          const { storageId } = await result.json();
          await sendImage({
            body: caption!,
            author,
            document: storageId,
          });

          setImage(undefined);
          setCaption("");
          innerref.current?.close();
        }}
        encType="multipart/form-data"
        style={{
          marginTop: "2rem",
        }}
      >
        <input
          accept="image/*"
          type="file"
          onChange={(e) => setImage(e.target.files![0])}
        />
        <div className="flex items-center mt-[200px]">
          <input
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            name="body"
            placeholder="enter caption"
            id=""
          />
          <input type="submit" value="submit" />
        </div>
      </form>
    </Modal>
  );
}

export default function App() {
  const [name, setName] = useState<string>();
  const messages = useQuery(api.messages.list);
  const sendMessage = useMutation(api.messages.send);

  const modalRef = useRef<HTMLDialogElement>(null);

  const [newMessageText, setNewMessageText] = useState("");

  useEffect(() => {
    const stored_ = localStorage.getItem("name");
    if (stored_) setName(stored_);
    else {
      const new_ = faker.person.firstName();
      localStorage.setItem("name", new_);
      setName(new_);
    }
  }, []);

  function scrollBottom() {
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  }

  useEffect(() => {
    scrollBottom();
  }, [messages?.length]);

  return (
    <>
      <SendImageModal innerref={modalRef} author={name as string} />
      <div className="w-[min(1080px,96%)] mx-auto">
        <main className="bg-black">
          <header className="sticky top-0 bg-black/70 backdrop-blur-3xl border-b py-2">
            <div className="mb-1">
              <h1 className="text-white text-6xl font-medium">Chat here</h1>
            </div>
            <p className="text-green-500 ml-1">
              Connected as{" "}
              <strong className="text-[var(--text-primary)]">{name}</strong>
            </p>
          </header>
          <div className="my-8">
            {messages?.map((message) => (
              <article
                key={message._id}
                className={`message ${message.author === name ? "mine" : ""}`}
              >
                <div className="content">
                  {message.author !== name ? (
                    <legend className="text-base font-medium">
                      {message.author}:
                    </legend>
                  ) : null}
                  {message.document ? (
                    <img
                      src={message.document}
                      style={{ aspectRatio: 1 }}
                      width="300px"
                      alt=""
                    />
                  ) : null}
                  <p className="text-sm">{message.body}</p>
                </div>
              </article>
            ))}
          </div>

          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (!name || !newMessageText) return;
              await sendMessage({ body: newMessageText, author: name });
              setNewMessageText("");
            }}
            className="w-full flex items-center gap-4 sticky bottom-0 bg-black py-4"
          >
            <div
              onClick={scrollBottom}
              className="absolute border grid place-content-center aspect-square w-8 right-0 bottom-[100%] cursor-pointer rounded-full bg-[var(--bubbles-background)]"
            >
              <BiDownArrowAlt size={22} />
            </div>
            <button
              onClick={() => modalRef.current?.showModal()}
              className="cursor-pointer border p-1"
            >
              <IoIosAttach size={22} />
            </button>
            <input
              value={newMessageText}
              onChange={async (e) => {
                const text = e.target.value;
                setNewMessageText(text);
              }}
              placeholder="Write a message…"
              className="w-full px-4 py-2 rounded"
            />
            <button
              type="submit"
              disabled={!newMessageText}
              className="border p-1 cursor-pointer"
            >
              Send
            </button>
          </form>
        </main>
      </div>
    </>
  );
}
