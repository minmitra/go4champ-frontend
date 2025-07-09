import React from 'react';
import './FAQ.css';

const faqs = [
  {
    category: "Konto & Anmeldung",
    questions: [
      { q: "Kann ich Go4Champion auch ohne Anmeldung nutzen?", a:  "Nein, für die vollständige Nutzung aller Funktionen benötigst du ein Konto." },
      { q: "Wie registriere ich mich?", a: "Gehe zur Startseite und klicke unten rechts auf den Button 'Mitglied werden'. Folge dann den Schritten zur Kontoerstellung." },
      { q: "Wie kann ich mein Passwort zurücksetzen?", a: "Klicke auf 'Passwort vergessen' auf der Login-Seite und folge den Anweisungen zur Wiederherstellung." }
    ]
  },
    {
    category: "Profil & Einstellungen",
    questions: [
        { q: "Kann ich meine Ziele und Präferenzen später ändern?", a: "Ja, du kannst deine Ziele und Präferenzen jederzeit ändern. Gehe dazu in dein Profil und klicke auf 'Profil bearbeiten'." },
        { q: "Kann ich mein Equipment später noch anpassen?", a: "Ja, auch dein Equipment kannst du jederzeit über 'Profil bearbeiten' im Profil aktualisieren." },
    ]
  },
  {
    category: "Trainings & Workouts",
    questions: [
      { q: "Wie starte ich ein Workout?", a: "Lass dir im Bereich 'Mein Workout' ein Training erstellen. Du kannst es direkt dort oder im Bereich 'Heutiges Workout' starten." },
      { q: "Was passiert, wenn ich ein Workout abbreche?", a: "Du kannst ein Workout jederzeit abbrechen. Es gibt aktuell keine negativen Folgen. Du kannst es später einfach neu starten oder ein anderes Workout auswählen." },
      { q: "Kann ich mein Training neu generieren lassen?", a: "Ja, du kannst dir jederzeit neue Trainings basierend auf deinen Einstellungen erstellen lassen." }
    ]
  },
  {
    category: "Challenges",
    questions: [
      { q: "Gibt es Challenges mit Freunden?", a: "Ja, du kannst Freunde hinzufügen und Challenges starten, zum Beispiel wer mehr Workouts, mehr Wiederholungen macht oder schneller ist. Deine Challenges werden automatisch gespeichert, sodass du jederzeit sehen kannst, wer wie oft gewonnen hat." },
      { q: "Wo finde ich meine Challenge-Historie?", a: "Unter 'Challenges' findest du eine Übersicht über alle bisherigen Duelle mit Freunden, inklusive Sieg/Niederlage, Zeit und Workout." },
    ]
  },
  {
    category: "Ernährung",
    questions: [
      { q: "Wie kann ich meine Ernährung tracken?", a: "Im Bereich 'Ernährung' kannst du mithilfe unserer KI-Funktion Mahlzeiten eingeben und analysieren lassen." },
      { q: "Werden Allergien oder Vorlieben bei der Planung berücksichtigt?", a: "Ja, bei der Erstellung deines Ernährungsplans berücksichtigt unsere KI deine Allergien und Vorlieben." },
    ]
  },
  {
    category: "KI & virtueller Coach",
    questions: [
      { q: "Wie funktioniert mein virtueller Coach?", a: "Dein virtueller Coach begleitet dich durch dein Training und motiviert dich mit individuellen Hinweisen. Je aktiver du bist, desto mehr entwickelt sich dein virtueller Coach weiter." },
      { q: "Wie funktioniert die KI in der App?", a: "Unsere KI erstellt personalisierte Trainings- und Ernährungsvorschläge basierend auf deinen Zielen, Vorlieben und Angaben wie Allergien oder Fitnesslevel." },
    ]
  },
  {
    category: "Technisches",
    questions: [
      { q: "Auf welchen Geräten funktioniert die App?", a: "Go4Champion ist für Smartphones optimiert, läuft aber auch problemlos auf Laptops und Desktop-PCs in allen modernen Browsern." },
    ]
  }
];

const FAQ = () => {
  return (
    <main>
    <div className="faq-container">
      <h1 >Häufig gestellte Fragen (FAQ)</h1>
      {faqs.map((section, index) => (
        <div key={index} className="faq-section">
          <h2 className="faq-category">{section.category}</h2>
          {section.questions.map((item, i) => (
            <div key={i} className="faq-item">
              <h3 className="faq-question">{item.q}</h3>
              <p className="faq-answer">{item.a}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
    </main>
  );
};

export default FAQ;

