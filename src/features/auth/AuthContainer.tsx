import { AuthForm } from "./AuthForm";

export const AuthContainer = () => {
  const HERO_BG_URL =
    "https://www.contoureducation.com.au/wp-content/uploads/2023/10/hero-bg-mov.png";

  return (
    <div className="flex min-h-screen">
      <div
        className="hidden w-1/2 shrink-0 md:block"
        style={{
          backgroundImage: `url(${HERO_BG_URL})`,
          backgroundSize: "cover",
          backgroundPosition: "top",
          backgroundRepeat: "no-repeat",
        }}
        role="img"
        aria-label="Hero background"
      />

      <div className="flex w-full flex-1 items-center justify-center bg-background p-8 md:w-1/2">
        <div className="w-full max-w-md">
          <AuthForm />
        </div>
      </div>
    </div>
  );
};
