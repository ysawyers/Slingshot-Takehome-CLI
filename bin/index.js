#! /usr/bin/env node
const { Command } = require('commander');
const program = new Command();

const fs = require('fs');
const axios = require('axios');

const aws = '3.84.49.141';

program.name('string-util').description('Welcome! Use this CLI to write/read to global trie.').version('1.0.0');

function treeTraversal(currentNode, completedWord) {
  completedWord += currentNode.char;
  if (currentNode.isCompletedWord) {
    console.log(completedWord);
  }

  if (currentNode.children !== null) {
    for (let i = 0; i < currentNode.children.length; i++) {
      treeTraversal(currentNode.children[i], completedWord);
    }
  }
}

program
  .command('display')
  .description('Display trie')
  .action(() => {
    axios(`http://${aws}:8080/trie/display`)
      .then(({ data }) => {
        const rootNode = data;
        treeTraversal(rootNode, '');
      })
      .catch((error) => {
        console.log(error);
      });
  });

program
  .command('insert')
  .description('Inserts keyword into trie')
  .argument('<string>', 'Keyword to insert')
  .action((keyword, _) => {
    axios
      .post(`http://${aws}:8080/trie/insert`, {
        word: keyword,
      })
      .then(() => {
        console.log('Inserted ' + keyword + ' to global trie.');
      })
      .catch((error) => {
        console.log(error);
      });
  });

program
  .command('delete')
  .description('Deletes keyword from trie')
  .argument('<string>', 'Keyword to delete')
  .action((keyword, _) => {
    axios
      .delete(`http://${aws}:8080/trie/delete`, { data: { word: keyword } })
      .then(() => {
        console.log('Deleted ' + keyword + ' to global trie.');
      })
      .catch((error) => {
        console.log(error);
      });
  });

program
  .command('search')
  .description('Checks if keyword exists in trie')
  .argument('<string>', 'Keyword to validate')
  .action((keyword, _) => {
    axios
      .post(`http://${aws}:8080/trie/search`, { word: keyword })
      .then(({ data }) => {
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
      });
  });

program
  .command('autocomplete')
  .description('Checks prefix against trie returning keywords')
  .argument('<string>', 'Prefix to autocomplete')
  .action((prefix, _) => {
    axios
      .post(`http://${aws}:8080/trie/autocomplete`, { word: prefix })
      .then(({ data }) => {
        if (data.length) {
          for (let i = 0; i < data.length; i++) {
            console.log(`${i + 1}. ` + data[i]);
          }
        } else {
          console.log(`No words exist in trie with prefix ${prefix}`);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  });

program
  .command('upload')
  .description('Uploads txt file of words to trie')
  .argument('<file_path>', 'Path to txt file')
  .action((filePath, _) => {
    fs.readFile(filePath, 'utf8', async (err, data) => {
      if (err) {
        console.error(err);
        return;
      }

      let words = data.split(' ').filter((word) => {
        if (word === '') {
          return false;
        }
        return true;
      });

      let promises = [];
      for (let i = 0; i < words.length; i++) {
        promises.push(
          new Promise(async () => {
            await axios.post(`http://${aws}:8080/trie/insert`, { word: words[i] });
          })
        );
      }

      await Promise.all(promises);
      console.log('Words successfully uploaded to trie!');
    });
  });

program.parse();
