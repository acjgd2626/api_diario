
/**
 * Servicio de Sugerencias para el Diario (Sin IA Externa)
 * 
 * Este servicio proporciona sugerencias reflexivas y afirmaciones positivas
 * de forma local, asegurando privacidad total y funcionamiento 100% offline.
 */

const journalPrompts = [
    "¿Cómo te sentiste hoy al despertar y notar los cambios en tu cuerpo?",
    "¿Qué mensaje le enviarías a tu bebé si pudiera leerlo hoy mismo?",
    "Describe un momento de paz que hayas tenido durante el día.",
    "¿Qué es lo que más te emociona de conocer a tu bebé?",
    "¿Cómo ha cambiado tu perspectiva sobre la vida desde que supiste que estabas embarazada?",
    "Escribe sobre una canción o sonido que te haya hecho pensar en tu bebé hoy.",
    "¿Qué miedos o dudas te gustaría soltar hoy para sentirte más tranquila?",
    "Describe la primera vez que sentiste un movimiento o una 'patadita'.",
    "¿Qué valores o enseñanzas esperas transmitir a tu hijo/a?",
    "¿Cómo te estás cuidando a ti misma física y emocionalmente en esta etapa?",
    "Haz una lista de tres cosas por las que estás agradecida hoy.",
    "¿Qué nombre o apodo cariñoso le dices a tu bebé en secreto?",
    "Imagina un día perfecto con tu bebé en brazos. ¿Cómo sería?",
    "¿Cómo ha reaccionado tu entorno (pareja, familia, amigos) a esta gran noticia?",
    "Escribe sobre un antojo o una sensación nueva que hayas experimentado recientemente."
];

const affirmations = [
    "Mi cuerpo es sabio, fuerte y capaz.",
    "Confío plenamente en mi capacidad para dar vida.",
    "Cada día estoy más conectada con mi bebé.",
    "Elijo la paz, la gratitud y la alegría en este viaje.",
    "Soy la madre perfecta para mi hijo/a.",
    "Mi bebé y yo estamos sanos, seguros y amados.",
    "Acepto con amor cada cambio en mi cuerpo y en mi vida.",
    "Mi instinto me guía hacia lo mejor para nosotros.",
    "Cada respiración me llena de calma y confianza.",
    "Estoy rodeada de amor y apoyo incondicional."
];

const babyNames = {
    niña: ["Sofía", "Isabella", "Lucía", "Valentina", "Emma", "Martina", "Elena", "Mía", "Victoria", "Sara"],
    niño: ["Mateo", "Santiago", "Sebastián", "Leonardo", "Alejandro", "Daniel", "Lucas", "Gabriel", "Samuel", "Nicolás"],
    cualquiera: ["Amor", "Luz", "Paz", "Cielo", "Vida", "Sol", "Río", "Mar", "Noah", "Ariel"]
};

/**
 * Genera una pregunta aleatoria para inspirar la escritura en el diario.
 */
export const generateJournalPrompt = async (topic?: string): Promise<string> => {
    const randomIndex = Math.floor(Math.random() * journalPrompts.length);
    return journalPrompts[randomIndex];
};

/**
 * Devuelve una lista de 5 afirmaciones aleatorias.
 */
export const generateAffirmations = async (): Promise<string[]> => {
    const shuffled = [...affirmations].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 5);
};

/**
 * Sugiere nombres de bebé basados en el género.
 */
export const suggestBabyNames = async (gender: 'niña' | 'niño' | 'cualquiera', style?: string): Promise<string[]> => {
    const list = babyNames[gender] || babyNames.cualquiera;
    const shuffled = [...list].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 5);
};
