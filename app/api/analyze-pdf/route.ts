export async function POST() {
  return Response.json(
    {
      error:
        "PDF en beta: algunos PDFs pueden fallar dependiendo de cómo fueron generados. Si no funciona, prueba subir una foto del documento o pegar el texto directamente.",
      beta: true,
    },
    { status: 501 }
  );
}
