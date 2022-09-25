const POEM = [
  {
    piSlice: 3,
    a: "Here I am a wet , market smile on your absent face still",
    b: "delivering that neighbourly something to our hood" 
  },
  {
    piSlice: 2,
    a: "Here I am all together chinked by the overhearing",
    b: "of a featherweight junction’s heavy breathing" 
  },
  {
    piSlice: 1,
    a: "Here I am the other white people , a new Israelite vector",
    b: "starting from the horrible reach of her empty touch" 
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
