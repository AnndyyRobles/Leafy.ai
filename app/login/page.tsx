import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { LoginForm } from "@/components/auth/login-form"

export const metadata: Metadata = {
  title: "Login | Leafy.ai",
  description: "Login to your Leafy.ai account",
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-white px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center justify-center space-y-2 text-center">
          <Image
            src="/placeholder.svg?height=40&width=40"
            width={40}
            height={40}
            alt="Leafy.ai Logo"
            className="h-10 w-10 rounded-full bg-green-500"
          />
          <h1 className="text-2xl font-semibold tracking-tight">Iniciar sesión</h1>
          <p className="text-sm text-muted-foreground">Ingresa tus credenciales para acceder a tu cuenta</p>
        </div>

        <LoginForm />

        <div className="text-center text-sm">
          ¿No tienes una cuenta?{" "}
          <Link href="/register" className="font-medium text-green-600 hover:text-green-500">
            Regístrate
          </Link>
        </div>
      </div>
    </div>
  )
}

