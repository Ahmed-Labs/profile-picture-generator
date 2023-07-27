import { type NextPage } from "next";
import { useState } from "react";
import Image from "next/image";
import { Button } from "~/components/Button";
import { Input } from "../components/Input";
import { FormGroup } from "~/components/FormGroup";
import { api } from "~/utils/api";

const GeneratePage: NextPage = () => {
  const [form, setForm] = useState({
    prompt: "",
  });
  const [imageUrl, setImageUrl] = useState("");

  const generateIcon = api.generate.generateIcon.useMutation({
    onSuccess(data) {
      if (!data.imageUrl) return;
      setImageUrl(data.imageUrl);
    },
  });

  function updateForm(key: string) {
    return function (e: React.ChangeEvent<HTMLInputElement>) {
      setForm({ ...form, [key]: e.target.value });
    };
  }

  function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    generateIcon.mutate({ prompt: form.prompt });
    setForm({ prompt: "" });
  }

  return (
    <>
      <main className="container mx-auto mt-24 flex min-h-screen max-w-6xl flex-col gap-4 px-24">
        <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
          <FormGroup>
            <label>Prompt</label>
            <Input onChange={updateForm("prompt")} value={form.prompt} />
          </FormGroup>

          <Button
            disabled={generateIcon.isLoading}
            isLoading={generateIcon.isLoading}
            type="submit"
          >
            Submit
          </Button>
        </form>

        {imageUrl && (
          <>
            <h2>Your icons:</h2>
            <section className="grid grid-cols-4 gap-4">
              <Image
                src={imageUrl}
                className="w-full"
                alt="generated icon"
                height={400}
                width={400}
              />
            </section>
          </>
        )}
      </main>
    </>
  );
};

export default GeneratePage;
