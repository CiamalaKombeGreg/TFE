export function getDatesPeriode(dateDebut: Date, dateFin:Date) {
  const dates: string[] = [];
  const debut = dateDebut;
  const fin = dateFin;

  // Vérifier si les dates sont valides
  if (debut.getTime() > fin.getTime()) {
    dates.push(debut.toISOString().split('T')[0]);
    return dates; // Retourner un tableau vide si la date de début est après la date de fin
  }

  // Ajouter la date de début au tableau
  dates.push(debut.toISOString().split('T')[0]);

  // Ajouter les dates intermédiaires
  let dateCourante = new Date(debut);
  while (dateCourante.getTime() < fin.getTime()) {
    dateCourante.setDate(dateCourante.getDate() + 1);
    dates.push(dateCourante.toISOString().split('T')[0]);
  }

  return dates;
}