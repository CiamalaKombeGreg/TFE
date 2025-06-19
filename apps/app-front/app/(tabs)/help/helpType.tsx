import { ScrollView, Text, View, Pressable } from 'react-native';
import { useState } from 'react';

const HelpItem = ({ title, description }: { title: string; description: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <View className="mb-2">
      <Pressable onPress={() => setOpen(!open)} className="border-b border-gray-300 pb-2">
        <Text className="font-semibold text-lg text-gray-800">{title}</Text>
      </Pressable>
      {open && <Text className="text-gray-700 text-sm mt-1">{description}</Text>}
    </View>
  );
};

const HelpType = () => {
  return (
    <ScrollView className="m-4">
      <Text className="text-2xl font-bold mb-4 text-gray-800">Types de congés</Text>

      <HelpItem
        title="Légaux"
        description="Congés obligatoirement souscrit par l'employeur, en général 20 jours (dans certains cas)."
      />
      <HelpItem
        title="Férié"
        description="Congés prévus par la loi belge, incluant les 10 jours fériés légaux annuels : 1er janvier, lundi de Pâques, 1er mai, Ascension, lundi de Pentecôte, 21 juillet, 15 août, 1er novembre, 11 novembre, 25 décembre."
      />
      <HelpItem
        title="Télétravail"
        description="Période validée de travail à distance. Peut être régulière ou occasionnelle, selon accord de l'employeur."
      />
      <HelpItem
        title="Extra-légaux"
        description="Avantages supplémentaires offerts par l'employeur en Belgique, comme des jours de congé en plus du minimum légal."
      />
      <HelpItem
        title="Sans solde"
        description="Congé non rémunéré accordé à la demande du travailleur. Il n'est pas un droit mais peut être négocié."
      />
      <HelpItem
        title="Maladie"
        description="L'employeur paie le salaire durant le premier mois, puis c'est la mutuelle qui prend le relais. Certificat obligatoire."
      />
      <HelpItem
        title="Paternité"
        description="20 jours de congés pour le père ou le co-parent à prendre dans les 4 mois suivant la naissance."
      />
      <HelpItem
        title="Maternité"
        description="15 semaines en Belgique : 6 semaines avant et 9 semaines après la naissance. Obligatoire et rémunéré."
      />
      <HelpItem
        title="Parental"
        description="Permet de suspendre ou réduire son travail pour s'occuper d'un enfant jusqu'à ses 12 ans (ou 21 si handicap)."
      />
      <HelpItem
        title="Enfant malade"
        description="Congé sans solde de maximum 10 jours par an pour s'occuper d'un enfant mineur malade à charge."
      />
      <HelpItem
        title="Assistance médicale"
        description="Interruption de carrière pour aider un proche gravement malade. Attestation médicale requise."
      />
      <HelpItem
        title="Maladie prolongée"
        description="En cas de longue maladie, la mutuelle continue à verser une indemnité."
      />
      <HelpItem
        title="Accident professionnel"
        description="Pris en charge par l'assurance accidents du travail de l'employeur."
      />
      <HelpItem
        title="Formation"
        description="Accordé pour suivre une formation reconnue, souvent dans le cadre du droit individuel à la formation."
      />
      <HelpItem
        title="Adoption"
        description="6 semaines minimum de congé pour accueillir un enfant adopté (plus selon l'âge de l'enfant)."
      />
      <HelpItem
        title="Soins palliatifs"
        description="1 mois renouvelable pour prodiguer des soins à une personne en fin de vie. Certificat requis."
      />
      <HelpItem
        title="Circonstance"
        description="Pour événements comme mariage, décès, communion, etc. Nombre de jours défini selon l'événement."
      />
      <HelpItem
        title="Impérieuse"
        description="Absence pour cas de force majeure ou situation imprévisible affectant un proche."
      />
    </ScrollView>
  );
}

export default HelpType;