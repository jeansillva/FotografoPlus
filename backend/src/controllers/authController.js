const users = [
  { id: 1, email: "professor@fotografo.com", password: "123456" }
];

export const login = (req, res) => {
  const { email, password } = req.body;

  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({ message: "Credenciais inválidas" });
  }

  res.json({
    message: "Login bem-sucedido",
    user: { id: user.id, email: user.email }
  });
};

export const register = (req, res) => {
  const { email, password } = req.body;

  const exists = users.some(u => u.email === email);
  if (exists) {
    return res.status(400).json({ message: "Usuário já cadastrado" });
  }

  const newUser = { id: Date.now(), email, password };
  users.push(newUser);

  res.status(201).json({
    message: "Usuário registrado com sucesso",
    user: { id: newUser.id, email: newUser.email }
  });
};
