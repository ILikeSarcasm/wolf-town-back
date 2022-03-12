import fs from 'fs';
import sharp from 'sharp';

if (process.argv.length <= 2) {
    console.log('Please, provide at least one token ID.');
    process.exit(1);
}

var wtanimalsFake = `${process.cwd()}/public/images/wtanimalsFake.png`;

for (var i=0; i<process.argv.length - 2; i++) {
    var tokenID = process.argv[2+i];
    var metadataPath = `${process.cwd()}/public/metadata/${tokenID}.json`;
    var tokenImagePath = `${process.cwd()}/public/images/animals/${tokenID}.png`;

    try {
        var metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));

        var traitExists = false;
        for (var j=0; j<metadata.attributes.length; j++) {
            if (metadata.attributes[j].trait_type == 'Integrity') {
                metadata.attributes[j].value = 'Fake';
                traitExists = true;
                break;
            }
        }

        if (!traitExists) {
            metadata.attributes.push({ trait_type: 'Integrity', value: 'Fake' });
        }
        
        fs.writeFileSync(metadataPath, JSON.stringify(metadata));
        await (sharp(tokenImagePath).composite([{ input: wtanimalsFake }]).toFile(`${tokenImagePath}.fake.png`));
        fs.unlinkSync(tokenImagePath);
        fs.renameSync(`${tokenImagePath}.fake.png`, tokenImagePath);
    } catch (error) { console.error(`animals.js:setFakeTokenIDs ${error}`); }
}

console.log('Done.');
