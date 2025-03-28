import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { RegisterForm } from "@/components/auth/register-form"

export const metadata: Metadata = {
  title: "Register | Leafy.ai",
  description: "Create a new Leafy.ai account",
}

export default function RegisterPage() {
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
          <h1 className="text-2xl font-semibold tracking-tight">Crear una cuenta</h1>
          <p className="text-sm text-muted-foreground">Ingresa tus datos para registrarte en Leafy.ai</p>
        </div>

        <RegisterForm />

        <div className="text-center text-sm">
          ¿Ya tienes una cuenta?{" "}
          <Link href="/login" className="font-medium text-green-600 hover:text-green-500">
            Inicia sesión
          </Link>
        </div>
      </div>
    </div>
  )
}

