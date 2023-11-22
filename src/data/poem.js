const POEM = [
  {
    piSlice: 3,
    a: "a wet, market smile on her forgotten face still",
    b: "spreading our neighbourly chill around the ward" 
  },
  {
    piSlice: 2,
    a: "all together chinked by the overhearing",
    b: "of a featherweight junction's heavy breathing" 
  },
  {
    piSlice: 1,
    a: "the other white people, a new Israelite vector",
    b: "starting from the horrible reach of her empty touch" 
  },
  {
    piSlice: 1,
    a: "the superstitious cleaving to silence's rift",
    b: "stuttered into being before the first, broken word" 
  },
  {
    piSlice: 4,
    a: "too openly expectant and bright yellow for",
    b: "a blossom jumping out between concrete slabs" 
  },
  {
    piSlice: 1,
    a: "never honestly small enough to - like dust",
    b: "the ashen toss and turn - sink into the nothing special" 
  },
  {
    piSlice: 5,
    a: "this bird I torture, aflutter over the azure",
    b: "promise again, smack into its glassy brilliance" 
  },
  {
    piSlice: 9,
    a: "a headless extrusion on the verge wailing",
    b: "peacably on behalf of an unlimited injury" 
  },
  {
    piSlice: 2,
    a: "the man waving to my woman as she rides me",
    b: "like a mare, down May's flowery avenues" 
  }
];

export const POEM_PARSED = POEM.map((verse) => {
  const verseParsed = {
    piSlice: verse.piSlice,
    a: verse.a.split(' '),
    b: verse.b.split(' ')
  }
  return verseParsed;
});
