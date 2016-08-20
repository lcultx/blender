VERBOSE = True
VERBOSE_TYPE = False
VERBOSE_DOCS = False
SKIP_RECURSIVE = False
common_types = float, int, bool, type(None), str
 
def seek(r, txt, end = '\n'):
	newtxt = ''
 
	if type(r) in (float, int, type(None)): # basic types
		print('%s%s' % (txt, r), end=end)
		return
	if type(r) in (str, bool):
		print('%s"%s"' % (txt, r), end=end)
		return		

	try:	keys = r.keys()
	except: keys = None
 
	try:	__members__ = r.__members__
	except: __members__ = []
 
	for item in __members__:
		newtxt = txt + '\t'
 
		if item == 'rna_type' and not VERBOSE_TYPE: # just avoid because it spits out loads of data
			continue
 
		if SKIP_RECURSIVE:
			if item in txt:
				continue
 
		attr = getattr(r, item)
 
		if type(attr) in common_types:
			print('%s<%s>' % (txt, item), end='')
			seek( attr, '', ''),
			print('</%s>' % (item))
		else:
			print('%s<%s>' % (txt, item))
			seek( attr, txt, '')
			print('%s</%s>' % (txt, item))
 
 
	if keys:
		for k in keys:
			newtxt = txt + '\t'
			print('%s<item key="%s">' % (txt, k))
			seek(r[k], newtxt)
			print('%s</item>' % (txt))
 
	else:
		try:	length = len( r )
		except:	length = 0
 
		for i in range(length):
			newtxt = txt + '\t'
 
			attr = r[i]
			if type(attr) in common_types:
				print('%s<item index="%d">' % (newtxt, i), end = '')
				seek(attr, '', '')
				print('</item>')
			else:
				print('%s<item index=%d>' % (newtxt, i))
				seek(attr, newtxt+'\t')
				print('%s</item>' % (newtxt))
 
