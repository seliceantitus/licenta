import math

distances = [
	[5, 6, 5, 7, 4, 6, 5, 9, 3, 5],
	[3, 4, 3, 5, 2, 4, 3, 7, 1, 3]
]

vertices = []

z = 0
angle = 0
index = 1
rad = (math.pi / 180.00) * 36

f = open("points.obj","w")

for distance in distances:
	vert = []
	for d in distance:
		x = math.sin(angle) * d
		y = math.cos(angle) * d
		
		angle = angle + rad
		vert.append(index)
		index = index + 1
		
		f.write("v %f %f %f 1.0\n" % (x, y, z))
	vertices.append(vert)
	z = z + 1.5;
	angle = 0

for vertexSet in vertices:
	for i in range(0, len(vertexSet) - 1):
		f.write("l %d %d\n" % (vertexSet[i], vertexSet[i + 1]))

combined = zip(vertices[0], vertices[1])

for i in range(0, len(combined)):
	if (i == len(combined) - 1):
		f.write("f %d %d %d %d\n" % (combined[i][0], combined[0][0], combined[0][1], combined[i][1]))
	else:
		f.write("f %d %d %d %d\n" % (combined[i][0], combined[i + 1][0], combined[i + 1][1], combined[i][1]))

for vL, vH in zip(vertices[0], vertices[1]):
	f.write("l %d %d\n" % (vL, vH))

f.close()