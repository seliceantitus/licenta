import math

distances = [[16.13345,16.17766,16.13035,16.12384,16.12603,16.12797,16.12433,16.1283,16.13028,16.174,16.12445,16.12478,16.1722,16.17293,16.12523,16.12684,16.16997,16.13552,16.12216,16.12699],[16.11037,16.10976,16.11187,16.10945,16.11217,16.10701,16.11268,16.11291,16.11259,16.10954,16.10828,16.15797,16.10632,16.10744,16.11133,16.16255,16.16526,16.10879,16.11098,16.15965],[16.11119,16.11544,16.11294,16.11162,16.11446,16.1117,16.10978,16.15726,16.11286,16.19154,16.11386,16.11021,16.11017,16.10895,16.1098,16.11405,16.11549,16.11565,16.1092,16.10798],[16.11327,16.16058,16.10913,16.1064,16.11267,16.10989,16.10656,16.10966,16.14117,16.10953,16.10138,16.10819,16.11371,16.11297,16.1085,16.11014,16.11248,16.16795,16.11363,16.10859],[16.10894,16.15931,16.11354,16.10903,16.11042,16.11164,16.11565,16.11094,16.15399,16.10696,16.11258,16.1558,16.10788,16.10967,16.11363,16.11274,16.11228,16.15579,14.75008,0]]

vertices = []

z = 0
index = 1

angle = 0
rad = (math.pi / 180.00) * 3.6

f = open("points.txt","w")

for distance in distances:
	vert = []
	for d in distance:
		x = math.sin(angle) * d
		y = math.cos(angle) * d
		
		angle = angle + rad
		vert.append(index)
		index = index + 1
		
		f.write('{')
		f.write('x: %f, y: %f, z: %f' % (x, y, z))
		f.write('},\n');
	print(len(vert));
	vertices.append(vert)
	z = z + 0.2;
	angle = 0

# for vertexSet in vertices:
# 	for i in range(0, len(vertexSet) - 1):
# 		f.write("l %d %d\n" % (vertexSet[i], vertexSet[i + 1]))

# combined = zip(vertices[0], vertices[1])

# for i in range(0, len(combined)):
# 	if (i == len(combined) - 1):
# 		f.write("f %d %d %d %d\n" % (combined[i][0], combined[0][0], combined[0][1], combined[i][1]))
# 	else:
# 		f.write("f %d %d %d %d\n" % (combined[i][0], combined[i + 1][0], combined[i + 1][1], combined[i][1]))

# for vL, vH in zip(vertices[0], vertices[1]):
# 	f.write("l %d %d\n" % (vL, vH))

f.close()