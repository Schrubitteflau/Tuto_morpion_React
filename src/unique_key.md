# Warning: Each child in an array or iterator should have a unique “key” prop. Check the render method of “Game”.

Quand on affiche une liste, React stocke des informations sur chaque élément de liste affiché. Lorsque nous mettons ensuite la liste à jour, React a besoin de déterminer quels éléments ont changé. Nous pourrions avoir ajouté, retiré, ré-ordonné ou mis à jour des éléments de la liste :

Imaginez que nous passions de ceci :
```html
<li>Alice : 7 tâches restantes</li>
<li>Bob : 5 tâches restantes</li>
```

...à ceci :
<li>Bob : 9 tâches restantes</li>
<li>Claudia : 8 tâches restantes</li>
<li>Alice : 5 tâches restantes</li>
```html

Noter que même s'il ne s'agit pas d'une liste HTML, à partir du moment qu'un tableau d'éléments est affiché par React, même s'il s'agit d'éléments `<div>` enfants d'une autre `<div>`.

En plus des compteurs à jour, un humain qui lirait cette liste percevrait certainement que nous avons inversé l'ordre d'Alice et Bob, et ajouté Claudia entre eux. Mais React n'est qu'un programme informatique, et n'a aucune idée de ce que nous voulions faire. Dans la mesure où il ne peut pas deviner nos intentions, nous avons besoin de spécifier une prop `key` pour chaque élément de liste, afin de les différencier les uns des autres. Une option consisterait à utiliser les chaînes `alice`, `bob` et `claudia`. Si nous affichions des données issues d'une base, Alice, Bob et Claudia auraient sûrement des IDs que nous pourrions utiliser comme clés.

```html
<li key={user.id}>{user.name} : {user.taskCount} tâches restantes</li>
```

Quand une liste est ré-affichée, React prend la clé de chaque élément de la liste et recherche un élément dans la liste précédente dont la clé correspondrait. S'il s'agit d'une nouvelle clé, React crée un composant. Si la nouvelle liste ne contient plus une clé qui existait par le passé, React détruit le composant devenu superflu. Si une correspondance est trouvée, le composant concerné est déplacé (si besoin). Les clés permettent à React d'associer une identité à chaque composant, ce qui lui permet de maintenir un état entre deux affichages. Si la clé d'un composant change, ce composant sera détruit et ré-créé avec un nouvel état.

La prop `key` est spéciale et réservée en React (ainsi que `ref`, une fonctionnalité plus avancée). Quand un élément est créé, React extrait sa prop `key` et la stocke directement sur l'élément renvoyé. Même si `key` semble appartenir aux `props`, elle n'est pas référençable via `this.props.key`. React l'utilise automatiquement pour décider quels composants mettre à jour. Un composant n'a aucun moyen de connaître sa `key`.

**Nous vous recommandons fortement de spécifier des clés appropriées partout où vous construisez des listes dynamiques**. Si vous ne trouvez pas de clé appropriée, c'est peut-être l'occasion de repenser la structure de vos données afin qu'elle en fournisse une.

Si aucune clé n'est spécifiée, React affichera un avertissement et utilisera par défaut l'index de l'élément dans le tableau. Mais recourir à l'index est problématique lorsqu'on essaie de ré-ordonner, ajouter ou supprimer des éléments. Passer explicitement `key={i}` évite l'avertissement, mais ne vous dispense pas de ces problèmes : nous conseillons d'éviter cette approche dans la majorité des cas.

Les clés n'ont pas besoin d'être uniques au global ; elles ont juste besoin d'être uniques au sein d'une liste donnée.

