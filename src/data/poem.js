const POEM = [
  {
    piSlice: 3,
    a: "a wet, market smile on her forgotten face still",
    b: "spreading our neighbourly chill around the ward" 
  },
  {
    piSlice: 2,
    a: "all together chinked by the overhearing",
    b: "of a featherweight junction’s heavy breathing" 
  },
  {
    piSlice: 1,
    a: "the other white people, a new Israelite vector",
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
