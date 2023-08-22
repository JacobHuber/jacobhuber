class Point {
  pos = { x: 0, y: 0 };
  radius = 2;
  xSpeed = 0;
  ySpeed = 0;
  maxSpeed = 0.4;
  count = 0;
  countMax = 1000;

  pulseDirection = false;
  lightnessValue = 0;
  colourValue = 0;
  colourOpaque = "hsla(0, 50, 50, 1)";
  colourTransparent = "hsla(0, 50, 50, 0)";

  constructor(pos, cv = null) {
    this.pos = pos;
    this.rollSpeed();

    this.lightnessValue = 50; //Math.random() * 100;
    this.colourValue = Math.random() * 360;
    if (cv !== null) this.colourValue = cv;

    this.updateColour();
  }

  updateColour() {
    this.setColour(this.colourValue, 80, this.lightnessValue);
  }

  setColour(h, s, l) {
    this.colourOpaque =
      "hsla(" +
      h.toString() +
      "," +
      s.toString() +
      "%," +
      l.toString() +
      "%, 1)";
    this.colourTransparent =
      "hsla(" +
      h.toString() +
      "," +
      s.toString() +
      "%," +
      l.toString() +
      "%, 0)";
  }

  equals(point) {
    const statement = this.pos.x == point.pos.x && this.pos.y == point.pos.y;

    return statement;
  }

  distance(point) {
    const dx = this.pos.x - point.pos.x;
    const dy = this.pos.y - point.pos.y;

    return (dx ** 2 + dy ** 2) ** 0.5;
  }

  // Randomly choose a new speed
  rollSpeed() {
    this.xSpeed = Math.random() * (this.maxSpeed * 2) - this.maxSpeed;
    this.ySpeed = Math.random() * (this.maxSpeed * 2) - this.maxSpeed;
  }

  tick() {
    this.pos.x += this.xSpeed;
    this.pos.y += this.ySpeed;

    this.count++;
    if (this.count % this.countMax == 0) {
      this.rollSpeed();
    }
  }

  draw(ctx) {
    ctx.lineWidth = 1;
    ctx.fillStyle = "red";
    ctx.strokeStyle = "red";

    ctx.beginPath();
    ctx.ellipse(this.pos.x, this.pos.y, this.radius, this.radius, 0, 0, 100);
    ctx.stroke();
    ctx.fill();
  }
}

class Triangle {
  a = null;
  b = null;
  c = null;

  points = [];
  edges = [];

  colour = "hsl(0, 50%, 100%)";

  constructor(points) {
    this.a = points[0];
    this.b = points[1];
    this.c = points[2];
    this.points = [this.a, this.b, this.c];
    this.edges = [
      [this.a, this.b],
      [this.b, this.c],
      [this.c, this.a],
    ];

    let lightness = 0;
    let colourV = 0;
    for (let p in this.points) {
      colourV += this.points[p].colourValue;
      lightness += this.points[p].lightnessValue;
    }
    colourV = Math.round(colourV / 3);
    lightness = Math.round(lightness / 3);

    this.colour =
      "hsl(" + colourV.toString() + ", 50%, " + lightness.toString() + "%, 1)";
  }

  getCircumcircle() {
    const d =
      2 *
      (this.a.pos.x * (this.b.pos.y - this.c.pos.y) +
        this.b.pos.x * (this.c.pos.y - this.a.pos.y) +
        this.c.pos.x * (this.a.pos.y - this.b.pos.y));
    const axay = this.a.pos.x ** 2 + this.a.pos.y ** 2;
    const bxby = this.b.pos.x ** 2 + this.b.pos.y ** 2;
    const cxcy = this.c.pos.x ** 2 + this.c.pos.y ** 2;

    const bycy = this.b.pos.y - this.c.pos.y;
    const cyay = this.c.pos.y - this.a.pos.y;
    const ayby = this.a.pos.y - this.b.pos.y;

    const cxbx = this.c.pos.x - this.b.pos.x;
    const axcx = this.a.pos.x - this.c.pos.x;
    const bxax = this.b.pos.x - this.a.pos.x;

    const d_recip = 1 / d;
    const ux = d_recip * (axay * bycy + bxby * cyay + cxcy * ayby);
    const uy = d_recip * (axay * cxbx + bxby * axcx + cxcy * bxax);

    let origin = new Point({ x: ux, y: uy });
    let radius = origin.distance(this.a);

    return {
      radius: radius,
      origin: origin,
    };
  }

  pointInCircumcircle(point) {
    const circumcircle = this.getCircumcircle();
    const dist = circumcircle.origin.distance(point);

    return dist <= circumcircle.radius;
  }

  getCentroid() {
    const centroid = new Point({
      x: (1 / 3) * (this.a.pos.x + this.b.pos.x + this.c.pos.x),
      y: (1 / 3) * (this.a.pos.y + this.b.pos.y + this.c.pos.y),
    });

    return centroid;
  }

  getMidpoints() {
    const BC = new Point({
      x: (1 / 2) * (this.b.pos.x + this.c.pos.x),
      y: (1 / 2) * (this.b.pos.y + this.c.pos.y),
    });

    const AC = new Point({
      x: (1 / 2) * (this.a.pos.x + this.c.pos.x),
      y: (1 / 2) * (this.a.pos.y + this.c.pos.y),
    });

    const AB = new Point({
      x: (1 / 2) * (this.a.pos.x + this.b.pos.x),
      y: (1 / 2) * (this.a.pos.y + this.b.pos.y),
    });

    return [BC, AC, AB];
  }

  hasEdge(edge) {
    const reverseEdge = [edge[1], edge[0]];

    for (let e = 0; e < this.edges.length; e++) {
      const currentEdge = this.edges[e];

      const normalOrder =
        currentEdge[0] == edge[0] && currentEdge[1] == edge[1];
      const reverseOrder =
        currentEdge[0] == edge[1] && currentEdge[1] == edge[0];
      if (normalOrder || reverseOrder) {
        return true;
      }
    }

    return false;
  }

  equals(triangle) {
    for (let e = 0; e < this.edges.length; e++) {
      if (!triangle.hasEdge(this.edges[e])) {
        return false;
      }
    }

    return true;
  }

  sharesPoints(triangle) {
    for (let p = 0; p < this.points.length; p++) {
      for (let p2 = 0; p2 < triangle.points.length; p2++) {
        if (this.points[p].equals(triangle.points[p2])) {
          return true;
        }
      }
    }

    return false;
  }

  drawGradientBlend(ctx) {
    // Draw Triangle Gradient Fill (Blended)
    const radius = this.getCircumcircle().radius * 1.8;
    const centroid = this.getCentroid();
    const midpoints = this.getMidpoints();

    const gradientPoints = midpoints.map((p) => {
      const factor = 0.15;
      return new Point({
        x: factor * p.pos.x + centroid.pos.x,
        y: factor * p.pos.y + centroid.pos.y,
      });
    });

    const gradients = this.points.map((p) => {
      const gradient = ctx.createRadialGradient(
        p.pos.x,
        p.pos.y,
        0,
        p.pos.x,
        p.pos.y,
        radius
      );

      gradient.addColorStop(0, p.colourOpaque);
      gradient.addColorStop(1, p.colourTransparent);
      // gradient.addColorStop(0, "#FF0000FF");
      // gradient.addColorStop(1, "#FF000000");

      return gradient;
    });

    ctx.beginPath();
    ctx.moveTo(this.a.pos.x, this.a.pos.y);
    ctx.lineTo(this.b.pos.x, this.b.pos.y);
    ctx.lineTo(this.c.pos.x, this.c.pos.y);
    ctx.closePath();

    ctx.lineWidth = 3;
    ctx.strokeStyle = "#000";
    ctx.fillStyle = "#000";
    ctx.fill(); // Fill with black

    ctx.globalCompositeOperation = "lighter";

    gradients.forEach((gradient) => {
      ctx.fillStyle = gradient;
      ctx.strokeStyle = gradient;
      ctx.fill();
    });

    ctx.globalCompositeOperation = "source-over";
  }

  draw(ctx) {
    this.drawGradientBlend(ctx);
  }
}

// Globals !
let points = []; // List of all points
let triangles = []; // List of triangles

let animate = true; // Whether or not to "play" the scene (runs tick() function)

let CANVAS_WIDTH = 0;
let CANVAS_HEIGHT = 0;

// Distance between a point's closest point
const MIN_DISTANCE = 500;
const MAX_DISTANCE = 1000;

window.addEventListener("resize", callbackWindowSize);

function callbackWindowSize() {
  const canvas = document.getElementById("canvas");

  CANVAS_WIDTH = window.innerWidth;
  CANVAS_HEIGHT = window.innerHeight;

  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;

  setup();
}

document.addEventListener("DOMContentLoaded", (event) => {
  callbackWindowSize();
  setInterval(tick, 3);
});

function setup() {
  points = [];

  createPoints();
  createTriangles();
}

function tick() {
  if (animate) {
    for (let p in points) {
      const point = points[p];
      point.tick();

      if (point.pos.x > CANVAS_WIDTH + MAX_DISTANCE) {
        point.pos.x = -MAX_DISTANCE + 5;
      } else if (point.pos.x < -MAX_DISTANCE) {
        point.pos.x = CANVAS_WIDTH + MAX_DISTANCE - 5;
      }

      if (point.pos.y > CANVAS_HEIGHT + MAX_DISTANCE) {
        point.pos.y = -MAX_DISTANCE + 5;
      } else if (point.pos.y < -MAX_DISTANCE) {
        point.pos.y = CANVAS_HEIGHT + MAX_DISTANCE - 5;
      }
    }

    createTriangles();
  }
  drawFrame();
}

function createPoints() {
  let x = -(Math.random() * (MAX_DISTANCE - MIN_DISTANCE));
  while (x < CANVAS_WIDTH + MAX_DISTANCE) {
    let y = -(Math.random() * (MAX_DISTANCE - MIN_DISTANCE));

    while (y <= CANVAS_HEIGHT + MAX_DISTANCE) {
      x += 1 * (Math.random() * MIN_DISTANCE * 2 - MIN_DISTANCE);
      points.push(new Point({ x: x, y: y }));

      y += MIN_DISTANCE + Math.random() * (MAX_DISTANCE - MIN_DISTANCE);
    }

    x += MIN_DISTANCE + Math.random() * (MAX_DISTANCE - MIN_DISTANCE);
  }
}

function BowyerWatson() {
  /*
	// pointList is a set of coordinates defining the points to be triangulated
	triangulation := empty triangle mesh data structure
	add super-triangle to triangulation // must be large enough to completely contain all the points in pointList
	for each point in pointList do // add all the points one at a time to the triangulation
	  badTriangles := empty set
	  for each triangle in triangulation do // first find all the triangles that are no longer valid due to the insertion
	     if point is inside circumcircle of triangle
	        add triangle to badTriangles
	  polygon := empty set
	  for each triangle in badTriangles do // find the boundary of the polygonal hole
	     for each edge in triangle do
	        if edge is not shared by any other triangles in badTriangles
	           add edge to polygon
	  for each triangle in badTriangles do // remove them from the data structure
	     remove triangle from triangulation
	  for each edge in polygon do // re-triangulate the polygonal hole
	     newTri := form a triangle from edge to point
	     add newTri to triangulation
	for each triangle in triangulation // done inserting points, now clean up
	  if triangle contains a vertex from original super-triangle
	     remove triangle from triangulation
	return triangulation
	*/

  // triangulation := empty triangle mesh data structure
  let triangulation = [];

  // add super-triangle to triangulation // must be large enough to completely contain all the points in pointList

  const distance = 10000;
  const point1 = new Point({ x: CANVAS_WIDTH / 2, y: -distance });
  const point2 = new Point({ x: -distance, y: CANVAS_HEIGHT + distance });
  const point3 = new Point({
    x: CANVAS_WIDTH + distance,
    y: CANVAS_HEIGHT + distance,
  });
  const superTriangle = new Triangle([point1, point2, point3]);

  triangulation.push(superTriangle);

  // for each point in pointList do // add all the points one at a time to the triangulation
  for (let p = 0; p < points.length; p++) {
    let point = points[p];

    // badTriangles := empty set
    let badTriangles = [];

    // for each triangle in triangulation do // first find all the triangles that are no longer valid due to the insertion
    for (let t = 0; t < triangulation.length; t++) {
      let triangle = triangulation[t];

      // if point is inside circumcircle of triangle
      if (triangle.pointInCircumcircle(point)) {
        // add triangle to badTriangles
        badTriangles.push(triangle);
      }
    }

    // polygon := empty set
    let polygon = [];

    // for each triangle in badTriangles do // find the boundary of the polygonal hole
    for (let t = 0; t < badTriangles.length; t++) {
      let triangle = badTriangles[t];

      // for each edge in triangle do
      for (let e = 0; e < triangle.edges.length; e++) {
        let edge = triangle.edges[e];

        // if edge is not shared by any other triangles in badTriangles
        let sharedEdge = false;
        for (let t2 = 0; t2 < badTriangles.length; t2++) {
          if (t == t2) continue;

          let otherTriangle = badTriangles[t2];

          if (otherTriangle.hasEdge(edge)) {
            sharedEdge = true;
            break;
          }
        }

        // add edge to polygon
        if (!sharedEdge) {
          polygon.push(edge);
        }
      }
    }

    // for each triangle in badTriangles do // remove them from the data structure
    for (let t = 0; t < badTriangles.length; t++) {
      // remove triangle from triangulation
      for (let t2 = 0; t2 < triangulation.length; t2++) {
        if (badTriangles[t].equals(triangulation[t2])) {
          triangulation.splice(t2, 1);
          t2 -= 1;
        }
      }
    }

    // for each edge in polygon do // re-triangulate the polygonal hole
    for (let e = 0; e < polygon.length; e++) {
      let pointsInTriangle = [];
      pointsInTriangle.push(polygon[e][0]);
      pointsInTriangle.push(polygon[e][1]);
      pointsInTriangle.push(point);

      // newTri := form a triangle from edge to point
      const newTri = new Triangle(pointsInTriangle);

      // add newTri to triangulation
      triangulation.push(newTri);
    }

    //triangles = triangulation;
    //drawFrame();
    //await new Promise(r => setTimeout(r, 2000));
  }

  // for each triangle in triangulation // done inserting points, now clean up
  //  if triangle contains a vertex from original super-triangle
  //     remove triangle from triangulation

  for (let t = 0; t < triangulation.length; t++) {
    const triangle = triangulation[t];
    if (triangle.sharesPoints(superTriangle)) {
      triangulation.splice(t, 1);
      t -= 1;
    }
  }

  // return triangulation
  return triangulation;
}

function createTriangles() {
  triangles = [];
  triangles = BowyerWatson();
}

function drawFrame() {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#FFF";
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  for (let t in triangles) {
    triangles[t].draw(ctx);
  }
}
