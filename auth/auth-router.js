const router = require("express").Router();
const bcryptjs = require("bcryptjs"); // hash pw
const Users = require("../jokes/model");
const { isValid } = require("../jokes/service");
const jwt = require("jsonwebtoken");
const vars = require("./vars");

router.post("/register", (req, res) => {
  const credentials = req.body;
  //生成或者Salt使用的Salt长度，默认为 10
  if (isValid(credentials)) {
    const rounds = process.env.BCRYPT_ROUNDS || 8;
    const hash = bcryptjs.hashSync(credentials.password, rounds);
    credentials.password = hash;
    // save the user to the database
    Users.add(credentials)
      .then((user) => {
        const token = generateToken(user);
        //req.session.loggedIn = true;
        res.status(201).json({
          id: user.id,
          username: user.username,
          department: user.department,
          token: token,
        });
      })
      .catch((error) => {
        res.status(500).json({ message: error.message });
      });
  } else {
    res.status(400).json({
      message:
        "please provide username and password and the password should be alphanumeric",
    });
  }
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (isValid(req.body)) {
    Users.findBy({ username })
      .then(([user]) => {
        // check that passwords match
        if (user && bcryptjs.compareSync(password, user.password)) {
          //save info about client inside the session(req.session)
          // req.session.loggedIn = true;
          // req.session.user = user;
          //produce sign and send the token
          const token = generateToken(user);

          res
            .status(200)
            .json({ message: `Welcome ${user.username}!`, yourToken: token });
        } else {
          // we will return 401 if the password or username are invalid
          // we don't want to let attackers know when they have a good username
          res.status(401).json({ message: "Invalid Credentials" });
        }
      })
      .catch((error) => {
        res.status(500).json(error);
      });
  } else {
    res.status(400).json({
      message:
        "please provide username and password and the password should be alphanumeric",
    });
  }
});

function generateToken(user) {
  const payload = {
    subject: user.id, // sub in payload is what the token is about
    username: user.username,
    // ...otherData
  };

  const options = {
    expiresIn: "1d", // show other available options in the library's documentation
  };

  // extract the secret away so it can be required and used where needed
  return jwt.sign(payload, vars.jwtSecret, options); // this method is synchronous
}

module.exports = router;
