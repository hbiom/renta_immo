import json
import pandas as pd
import numpy as np


def simulation_mensuelle(pret, apport, taux, taux_Assurance, n):
  '''Calcul des mesualité du crédit
  pret : montant total du pret
  apport : montant total de l'apport. Ne paspas être > au pret
  taux : taux du pret
  taux_Assurance : taux de l'assurance
  n : nombre d'année du prêt
  '''

  taux = taux/100 + taux_Assurance/100
  if taux > 0 and pret > apport and n > 0:
    capital_emprunte = pret - apport
    m = (capital_emprunte * (taux/12))/(1-(1+ taux/12)**(-12*n))
    return round(m,2)
  return 0

def prix_du_pret(pret, apport, taux, taux_Assurance, n):
  '''Prix total du prêt
  pret : montant total du pret
  apport : montant total de l'apport. Ne paspas être > au pret
  taux : taux du pret
  taux_Assurance : taux de l'assurance
  n : nombre d'année du prêt
  '''
  if pret > apport:
    capital_emprunte = pret - apport
    m = simulation_mensuelle(pret, apport, taux, taux_Assurance, n)
    return 0 if round((m*(n*12)) - capital_emprunte,2) < 0 else round((m*(n*12)) - capital_emprunte,2)
  return 0


def int_converter(string):
  '''convert string into integer'''
  if string == "":
    return 0
  else:
    return int(string)

def float_converter(string):
  '''convert string into float'''
  if string == "":
    return 0.0
  else:
    return float(string)


def calcul_impot(salaire_imposable, br_part):
  ''' calcul l'impot sur les salaire et la tranche marginal d'imposition (TMI)
  salaire_imposable : salaire imposable annuel
  br_part: nombre de part du foyer fiscal
  '''

  P1 = 10085
  P2 = 25710
  P3 = 73516
  P4 = 158122

  salaire_imposable = salaire_imposable/br_part
  TM1 = (P2 - P1) * 0.11
  TM2 = (P3 - P2) * 0.30
  TM3 = (P4 - P3) * 0.41

  if salaire_imposable >= P4:
    impot = (salaire_imposable - P4) * 0.45
    impot += TM1 + TM2 + TM3
    TMI = 0.45
  elif salaire_imposable >= P3:
    impot = (salaire_imposable - P3) * 0.41
    impot += TM1 + TM2
    TMI = 0.41
  elif salaire_imposable >= P2:
    impot = (salaire_imposable - P2) * 0.30
    impot += TM1
    TMI = 0.30
  elif salaire_imposable >= P1:
    impot = (salaire_imposable - P1) * 0.11
    TMI = 0.11
  else:
    impot = 0
    TMI = 0
  return round(impot,2), TMI


def simulation_amortissement(dico, revenu_locatif, année, charge, charge_hors_interet, tmi, mensualité):
  ''' Simulation de l'amortissement comptable des charges/travaux et des revenu
  dico
  revenu_locatif
  année
  charge
  charge_hors_interet
  tmi
  mensualité
  '''
  obj = json.loads(dico)
  charge_sociale = 0.172
  value_year = 0
  imposition = 0
  impot = 0
  cashflow = 0
  tmi = tmi + charge_sociale
  row = []
  col = []

  for i in range(0,année):
    sum_year_value = 0
    regime = [i+1]
    col = ['Annee']
    for name, data in obj.items():
      col.append(name)
      prix = data['prix']
      an = data['nbr_année']
      value = data['prix']/data['nbr_année']

      imposition = revenu_locatif - charge
      if i < an:
        sum_year_value += value
        imposition = imposition - sum_year_value
        impot = imposition*(tmi)
        impot = 0 if impot <= 0 else impot
        value_year = 0 if i >= an else value
        cashflow = (revenu_locatif/12 - (charge_hors_interet/12 + impot/12 + mensualité))
        regime.append(value_year)

      else:
        sum_year_value += 0
        imposition = imposition - sum_year_value
        impot = imposition*(tmi)
        impot = 0 if impot <= 0 else impot
        value_year = 0 if i >= an else value
        cashflow = (revenu_locatif/12 - (charge_hors_interet/12 + impot/12 + mensualité))
        #cashflow = (revenu_locatif - (charge_hors_interet + impot + mensualité))
        regime.append(value_year)

    regime.append(imposition)
    regime.append(impot)
    regime.append(charge_hors_interet)
    regime.append(revenu_locatif)
    regime.append(cashflow)
    regime = [round(num,0) for num in regime]

    row.append(regime)
  col.append('Imposition')
  col.append('Impot')
  col.append('Charges')
  col.append('Revenu')
  col.append('Cashflow')

  df = pd.DataFrame(row,columns=col)
  return df.to_dict()


def simulation_abbatement(revenu_locatif=0, année=1, charge_hors_interet=0, taux_abbatement=0, tmi=0, mensualité=0):
  ''' Calcul de l'amortissement comptable des charges/travaux et des revenu
  dico
  revenu_locatif
  année
  charge
  charge_hors_interet
  tmi
  mensualité
  '''
  charge_sociale = 0.172
  imposition = 0
  impot = 0
  deduction = 0
  cashflow = 0
  regime = 0

  tmi = tmi + charge_sociale
  row = []
  col = []

  for i in range(0,année):
    # sum_year_value = 0
    regime = [i+1]
    col = ['Annee']

    imposition = revenu_locatif*taux_abbatement
    impot = imposition*(tmi + 0.172)
    deduction = revenu_locatif*(1 - taux_abbatement)
    cashflow = (revenu_locatif/12 - (charge_hors_interet/12 + impot/12 + mensualité))
    regime.append(deduction)
    regime.append(imposition)
    regime.append(impot)
    regime.append(revenu_locatif)
    regime.append(cashflow)
    regime = [round(num,0) for num in regime]

    row.append(regime)
  col.append('Deduction')
  col.append('Imposition')
  col.append('Impot')
  col.append('Revenu')
  col.append('Cashflow')

  df = pd.DataFrame(row,columns=col)
  return df.to_dict()
