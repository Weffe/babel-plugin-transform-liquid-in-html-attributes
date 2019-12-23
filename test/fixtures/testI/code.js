var imgFilename = 'smiley-face.jpg';
var x = `
  <div>
    <img src="{{ '${imgFilename}' | asset_url }}" alt="smiley face"/>
  </div>
`;
