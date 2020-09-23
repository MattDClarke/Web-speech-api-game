export const words = [
  'rural',
  'otorhinolaryngologist',
  'colonel',
  'penguin',
  'sixth',
  'isthmus',
  'anemone',
  'squirrel',
  'choir',
  'worcestershire',
  'plural',
  'memoir',
  'draught',
  'phenomenon',
  'regularly',
  'brewery',
  'specific',
  'onomatopoeia',
  'psoriasis',
  'poignant',
  'aluminium',
  'otorhinolaryngological',
  'laodicean',
  'bourgeois',
  'bezlotoxumab',
  'sesquipedalian',
  'liaison',
  'beguile',
  'albeit',
  'obsequious',
  'unctuous',
  'phenylalanine',
  'supercalifragilisticexpialidocious',
  'rhombicosidodecahedron',
];

export const wordsByLength = words.sort((a, b) => a.length - b.length);

export function isValidWord(word) {
  return words.includes(word);
}
