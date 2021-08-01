import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// Square hérite du type de composant de base de React, Square est donc un type de composant
// Un composant accepte des paramètres ("props" pour propriétés) et renvoie via render() les
// vues à afficher
class Square_old extends React.Component {

    constructor(props) {
        super(props);

        /*
            https://www.freecodecamp.org/news/react-js-for-beginners-props-state-explained/

            - Les composants reçoivent des données de l'extérieur par le biais des props, à
            partir desquelles ils peuvent créer et gérer leur state
            - Les props servent à passer des données, le state permet de gérer les données
            - Les props sont en lecture seule et ne peuvent pas être modifiées par le composant
            qui les reçoit de l'extérieur
            - Les states peuvent être modifiées par le composant en question, mais c'est privé
            et donc pas accessible de l'extérieur
            - Les props ne peuvent être passées que d'un composant parent vers un composant enfant
            - Modifier le state doit être fait via la méthode setState(), qui provoque la mise
            à jour du DOM du composant dont le state (état) vient d'être mis à jour. React sait
            quelles parties du DOM du composant il doit recharger par rapport à ce qui a changé
            dans le state
        */

        console.log(props);

        // Initialisation de l'état local, qui est une donnée privée du composant
        this.state = {
            value: null
        };
    }

    // render() renvoie une description de ce que l'on veut voir à l'écran, qui est un élément React
    render() {
        return (
            // Syntaxe JSX simple à lire et à écrire
            // On peut accéder aux props du composant directement
            <button
                className="square"
                // Appel de onClick() passé par Board, qui appelle en fait this.handleClick(i)
                // dans le contexte de Board
                onClick={() => { this.props.onClick() }}
            >
                {this.props.value}
            </button>

            // Ceci est l'équivalent de :
            //React.createElement("button", { className: "square" }, /* TODO */);
        );
    }
}

/* Les fonctions composants constituent une manière plus simple d’écrire des composants qui ne contiennent
qu’une méthode render et n’ont pas leur propre état. Au lieu de définir une sous-classe de React.Component,
nous pouvons écrire une fonction qui prendra les props en argument, et renverra ce qui devrait être affiché.
Les fonctions composants sont moins fastidieuses à écrire que les classes, et de nombreux composants peuvent
être exprimés ainsi.
*/
function Square(props)
{
    return (
        <button
            className="square"
            onClick={ props.onClick}
        >
            { props.value }
        </button>
    );
}

class Board_old extends React.Component {

    constructor(props)
    {
        super(props);

        /*
            Pour récupérer les données d’enfants multiples, ou pour permettre à deux composants enfants de
            communiquer entre eux, il vous faut plutôt déclarer leur état partagé dans le composant parent.
            Ce composant parent peut alors leur repasser cet état au travers des props ; ainsi, les composants
            enfants sont synchronisés entre eux et avec le composant parent.
        */

        this.state = {
            squares: Array(9).fill(null),
            xIsNext: true
        };
    }

    handleClick(i) {

        // Si quelqu'un a gagné ou que la case a déjà été cliquée, on ne fait rien
        if (calculateWinner(this.state.squares) !== null || this.state.squares[i] !== null)
        {
            return;
        }

        // Copie du tableau, pour l'immutabilité
        const squares = this.state.squares.slice();
        /* Pourquoi l'immutabilité :
            - Pour faciliter l'implémentation de fonctionnalités complexes, comme le fait de stocker des
            états et de revenir à des états précédents (annuler et refaire certaines actions), donc on peut
            conserver des versions précédentes de l'historique pour les réutiliser par la suite
            - Détecter les modifications d'objets mutables est difficile, puisqu'il faudrait comparer l'objet
            mutable à des copies précédentes de son contenu et de l'arborescence d'objets interne qu'il pourrait
            contenir. Il est par contre facile de détecter le changement d'état si on utilise des objets immutables,
            puisqu'il suffit de comparer la référence du nouvel objet par rapport à celle de l'objet précédent.
            - Cela permet aussi la construction de composants purs
        */

        squares[i] = this.state.xIsNext ? 'X' : 'O';
        // Lorsque l'état de Board change, les composants Square sont automatiquement rafraîchis car render()
        // de Boards est appelé
        this.setState({
            squares,
            xIsNext: !this.state.xIsNext
        });
        // Puisque les composants Square ne maintiennent pas d'état, ils reçoivent leurs valeurs de Board
        // et l'informent lorsqu'on clique sur eux. Ce sont des composants contrôlés, car Board dispose d'un
        // contrôle complet sur eux
    }

    renderSquare(i) {
        console.log(`Rendering Square ${i}`);
        // En plus des éléments HTML classiques, on peut référer à d'autres composants qui fonctionnent
        // indépendamment des autres car chaque composant est isolé
        // Passage de props, du parent à l'enfant, qui sont récupérées passées au constructeur du composant
        return <Square
            value={this.state.squares[i]}
            // onClick est aussi considéré comme étant une prop
            // Lors du clic sur un Square, onClick fournie par Board est appelée
            onClick={() => this.handleClick(i)}

            // Dans React, les noms attributs (comme onClick) des l'élément DOM natifs (comme <button>) ont
            // un sens particulier. Par contre, pour les composants créés il n'y a pas de restriction par
            // rapport au nom, même si une convention pour les évènements est : on[Event] et handle[Event]
        />;
    }

    render() {
        const winner = calculateWinner(this.state.squares);
        let status;

        if (winner === null)
        {
            status = `Prochain joueur : ${(this.state.xIsNext ? 'X' : 'O')}`;
        }
        else
        {
            status = `Le joueur ${winner} a gagné`;
        }
    
        return (
            <div>
                <div className="status">{status}</div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}

// Maintenant, Board ne sert qu'à afficher l'état du jeu passé en prop : props.squares
class Board extends React.Component {

    renderSquare(i) {
      return (
        <Square
          value={this.props.squares[i]}
          // props.onClick(i) va appeler this.handleClick(i) dans le contexte de Game, qui va gérer
          // l'historique et l'état du jeu. Il va modifier son state (si case pas cliquée et jeu pas fini), ce qui
          // va provoquer un appel à render() et donc mettre à jour le DOM correspondant, dont celui de Board
          onClick={() => this.props.onClick(i)}
        />
      );
    }
  
    render() {
        return (
          <div>
            <div className="board-row">
              {this.renderSquare(0)}
              {this.renderSquare(1)}
              {this.renderSquare(2)}
            </div>
            <div className="board-row">
              {this.renderSquare(3)}
              {this.renderSquare(4)}
              {this.renderSquare(5)}
            </div>
            <div className="board-row">
              {this.renderSquare(6)}
              {this.renderSquare(7)}
              {this.renderSquare(8)}
            </div>
          </div>
        );
      }
  }

class Game extends React.Component {
    constructor(props)
    {
        super(props);

        this.state = {
            history: [{
                // État initial, aucune case remplie
                squares: Array(9).fill(null)
            }],
            xIsNext: true,
            stepNumber: 0
        }
    }

    goToMove(move)
    {
        // Seules les propriétés passées à l'objet seront mises à jour, l'objet state ne sera pas
        // remplacé par celui passé en paramètre
        this.setState({
            stepNumber: move,
            xIsNext: (move % 2 === 0)
        })
    }

    handleClick(i) {
        // Suppression des coups "futurs" (après être remonté dans le temps) que notre coup invaliderait
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
          return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            // concat() ne modifie pas le tableau d'origine contrairement à push()
          history: history.concat([{
            squares: squares,
          }]),
          xIsNext: !this.state.xIsNext,
          stepNumber: history.length
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        // step : { squares }, move: index
        const moves = history.map((step, move) =>
        {
            const description = (move === 0 ?
                "Revenir au début de la partie" :
                `Revenir au tour ${move}`);

            // Comme les tours ne sont jamais ré-ordonnés, retirés ou insérés (ailleurs qu’à la fin), nous
            // pouvons utiliser cet index comme clé sans que ça pose problème.
            return (
                <div key={move}>
                    <button
                        onClick={ () => this.goToMove(move) }
                    >
                            {description}
                    </button>
                </div>
            )
        });

        let status;
        if (winner) {
          status = winner + ' a gagné';
        } else {
          status = 'Prochain joueur : ' + (this.state.xIsNext ? 'X' : 'O');
        }
    
        // Puisque moves est un tableau d'élements JSX, React le détecte et va les afficher à la suite,
        // mais on obtient un avertissement dans la console :
        // Warning: Each child in an array or iterator should have a unique "key" prop. Check the render method of "Game"
        return (
          <div className="game">
            <div className="game-board">
              <Board
                squares={current.squares}
                onClick={(i) => this.handleClick(i)}
              />
            </div>
            <div className="game-info">
              <div>{status}</div>
              <ol>{moves}</ol>
            </div>
          </div>
        );
      }
}

function calculateWinner(squares)
{
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    for (const line of lines)
    {
        const [ a, b, c ] = line;
        if (squares[a] === squares[b] && squares[b] === squares[c])
        {
            return squares[a];
        }
    }

    return null;
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
