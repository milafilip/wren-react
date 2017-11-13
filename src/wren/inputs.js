const inputs = {
  DEBUG: true,
  dimensions: {
    width: 390.0,
    height: 430.0,
    roofOffset: 0,
    wallHeight: 240.0
  },
  sheet: {
    crenellations: {
      merlon: {
        width: 8.0,
        height: 6.5
      },
      crenel: {
        width: 12.0
      }
    }
  },
  fin: {
    frameWidth: 15.0,
    pointDistance: 30.0,
    width: 25.0,
    grip: {
      width: 18.0,
      holeWidth: 6.0
    }
  },
  material: {
    thickness: 1.8,
    height: 244.0,
    width: 122.0,
    notchHeight: 1.8 //18
  }
};

export const points = inputs => {
  return [
    [0, inputs.dimensions.height],
    [inputs.dimensions.width, inputs.dimensions.height],
    [
      inputs.dimensions.width,
      inputs.dimensions.height - inputs.dimensions.wallHeight
    ],
    // [inputs.dimensions.width / 2 + inputs.dimensions.roofOffset, 0],
    [0, inputs.dimensions.height - inputs.dimensions.wallHeight]
  ];
};

export default inputs;
