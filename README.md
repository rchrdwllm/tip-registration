<!-- cspell: disable -->
# To do

(So far na mga napansin q)

-   [x] Email inputs accept any string input (must be "@" followed by domain)
-   [x] Fix cases na 'di ina-accept ng email inputs:
    -   [x] Pag may "\_" ('di accepted yung example_asdf@gmail.com)
    -   [x] Pag walang "." ('di accepted yung example@gmail.com)
-   [ ] Personal information page
    -   [x] Add birthdate validation
    -   [ ] Add password validation
    -   [x] Fix blank select inputs
    -   [x] Save inputs to session storage
-   [x] Address and contact page
    -   [x] Fix layout
    -   [x] Save inputs to session storage
    -   [x] Gawing optional yung telephone number pero may validation na digits only dapat if ever na nag-input ang user

# Notes

-   May schools ba na may number sa name nila? If yes, i-allow na lang natin numbers sa top 2 schools input sa education part step 4
-   May regex ba para like limit yung year graduated hanggang 2023 lang? Like if 2024 yung ilagay, 'di ia-accept kasi wala pa naman tayo sa 2024
