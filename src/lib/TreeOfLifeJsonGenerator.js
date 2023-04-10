export default class TreeOfLifeJsonGenerator {
  constructor(groundZero) {
    if (groundZero === null) {
      const K = TreeOfLifeJsonGenerator;
      this.map = K.TREE_OF_LIFE_IN_MEMORY_OF_REGIS;
    }
  } 

  getSefirotByIndex(index) {
    return this.map[index];
  }

  static TREE_OF_LIFE_IN_MEMORY_OF_REGIS = {
    0: { 
      name: "High Park and Humberside", 
      coordinates: [ -79.466850201826219, 43.657227646269199 ],
      nodeId: 13465772
    },
    3: {
      name: "Shipman and Maria", 
      coordinates: [ -79.475580356435302, 43.666354317159403 ],
      nodeId: 13464314,
    }
  }
}