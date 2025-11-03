export async function POST(req, res) {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) {
    alert("Invalid username or password");
    return res.redirect("/login");
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    alert("Invalid username or password");
    return res.redirect("/login");
  }
  req.session.userId = user._id;
  res.redirect("/");
}