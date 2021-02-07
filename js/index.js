const apiUrl = 'http://localhost:3000/monsters/'
let currentUrl = 'http://localhost:3000/monsters/?_limit=50&_page=1'
const monsterContainer = document.getElementById( 'monster-container' )

function paginate( direction ) {
    fetch( currentUrl ).then( response => {
        let headers = response.headers.get( "Link" ).split( ", " ).map( header => header.split( "; " ) );
        let headersObject = Object.fromEntries( headers.map( header => [ header[1].replace( /"/g, "" ).replace( "rel=", "" ), header[0].slice( 1, -1 ) ] ) );
        if ( !!headersObject[ direction ] ) {
            currentUrl = headersObject[ direction ];
            fetchMonsters( headersObject[ direction ] );
        }
    } );
}

function fetchMonsters( url ){
    monsterContainer.innerHTML = "";
    fetch( url ).then( response => response.json() ).then( monsterData => monsterData.forEach( monster => renderMonster( monster ) ) );
}

function renderMonster( monster ){
    const thisMonster = document.createElement( 'div' );
    thisMonster.setAttribute( 'data-monster-id', monster.id );
    const thisName = document.createElement( 'h2' );
    thisName.innerHTML = `Name: ${monster.name}`;
    const thisAge = document.createElement( 'h4' );
    thisAge.innerHTML = `Age: ${monster.age}`;
    const thisDescription = document.createElement( 'p' );
    thisDescription.innerHTML = `Description: ${monster.description}`;
    thisMonster.append( thisName, thisAge, thisDescription );
    monsterContainer.append( thisMonster );
}

function createMonster( monsterSubmission ){
    monsterSubmission.preventDefault();
    const name = monsterSubmission.target.querySelector( 'input#name' ).value;
    const age = monsterSubmission.target.querySelector( 'input#age' ).value;
    const description = monsterSubmission.target.querySelector( 'input#description' ).value;
    const newMonster = {name, age, description};
    fetch( apiUrl, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify( newMonster ) }  ).then( response => response.json() ).then( monsterData => renderMonster( monsterData ) );
    monsterSubmission.target.reset();
}

document.addEventListener( "DOMContentLoaded", () => {
    fetchMonsters( currentUrl );
    document.getElementById( 'monster-form' ).addEventListener( 'submit', createMonster );
    document.getElementById( 'first' ).addEventListener( 'click', () => { paginate( "first" ) } );
    document.getElementById( 'back' ).addEventListener( 'click', () => { paginate( "prev" ) } );
    document.getElementById( 'forward' ).addEventListener( 'click', () => { paginate( "next" ) } );
    document.getElementById( 'last' ).addEventListener( 'click', () => { paginate( "last" ) } );
} );
