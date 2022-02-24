#! /usr/bin/env node
const { Command } = require('commander');
const program = new Command();

const axios = require('axios');

program.name('string-util').description('Welcome! Use this CLI to write/read to global trie.').version('1.0.0');

program
  .command('display')
  .description('Display trie')
  .action(() => {
    axios('http://localhost:8080/trie/display')
      .then(({ data }) => {
        console.log(JSON.parse(data.message));
      })
      .catch((error) => {
        console.log(error);
      });
  });

program
  .command('insert')
  .description('Inserts keyword into trie')
  .argument('<string>', 'Keyword to insert')
  .action((str, _) => {
    axios
      .post('http://localhost:8080/trie/insert', {
        word: str,
      })
      .then(({ data }) => {
        console.log(data.message);
      })
      .catch((error) => {
        console.log(error);
      });
  });

program
  .command('delete')
  .description('Deletes keyword from trie')
  .argument('<string>', 'Keyword to delete')
  .action((str, _) => {
    axios
      .delete('http://localhost:8080/trie/delete', { data: { word: str } })
      .then(({ data }) => {
        console.log(data.message);
      })
      .catch((error) => {
        console.log(error);
      });
  });

program
  .command('search')
  .description('Checks if keyword exists in trie')
  .argument('<string>', 'Keyword to validate')
  .action((str, _) => {
    axios
      .post('http://localhost:8080/trie/search', { word: str })
      .then(({ data }) => {
        console.log(data.message);
      })
      .catch((error) => {
        console.log(error);
      });
  });

program
  .command('autocomplete')
  .description('Checks prefix against trie returning keywords')
  .argument('<string>', 'Prefix to autocomplete')
  .action((str, _) => {
    axios
      .post('http://localhost:8080/trie/autocomplete', { word: str })
      .then(({ data }) => {
        console.log(data.message);
      })
      .catch((error) => {
        console.log(error);
      });
  });

program.parse();
