import { type NextPage } from "next";
import Input from "~/components/Input";
import FormGroup from "~/components/FormGroup";
import { useState } from "react";
import { api } from "~/utils/api";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "~/components/Button";
import Image from "next/image";
import { useBuyCredits } from "~/hooks/useBuyCredits";

const GeneratePage: NextPage = () => {
  const { buyCredits } = useBuyCredits();

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

  const session = useSession();
  const isLoggedIn = !!session.data;

  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center">
        {session.data?.user.name}
        <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
          <FormGroup>
            <label>Prompt</label>
            <Input onChange={updateForm("prompt")} value={form.prompt} />
          </FormGroup>

          <Button type="submit">Submit</Button>
        </form>

        {imageUrl && (
          <Image src={imageUrl} alt="generated icon" height={400} width={400} />
        )}
      </main>
    </>
  );
};

export default GeneratePage;
