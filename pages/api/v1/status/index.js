function status(request, response) {
  response.status(200).json({ chave: "são pessoas acima da media" });
}

export default status;
