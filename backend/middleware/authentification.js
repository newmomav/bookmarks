/*
Wir haben eine authorize middleware zum Überprüfen des jwt-Tokens erstellt
*/
const authorize = (req, res, next) => {
  /*
    Den Token holen wir uns mit "req.cookies" direkt aus dem Cookie und zwar mit dem Namen, den
    wir ihm beim Erstellen gegeben haben: "access_token"
    */
  const token = req.cookies.access_token;
  // Wird kein token gefunden schicken wir eine Fehlermeldung zurück
  if (!token) {
    return res.status(401).send("Zugriff verweigert!");
  }
  try {
    /*
        Hier überprüfen wir den jwt und bei Erfolg speichern wir die Userdaten im Request-Objekt,
        sodass wir später darauf zurückgreifen können
        */
    const data = jwt.verify(token, SECRET);
    if (!data) {
      return res.status(401).send("Validierung fehlgeschlagen!");
    }
    req.user = {
      username: data.username,
      role: data.role,
    };
    // Bei Erfolgreicher Prüfung übergeben wir an die nächste Middleware
    next();
  } catch (error) {
    res.status(500).send(error);
  }
};
