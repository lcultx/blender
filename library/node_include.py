class Unbuffered(object):
   def __init__(self, stream):
       self.stream = stream
   def write(self, data):
       self.stream.write(data)
       self.stream.flush()
   def __getattr__(self, attr):
       return getattr(self.stream, attr)

import sys
sys.stdout = Unbuffered(sys.stdout)

#import bydna
print("include")
#import js2py


import bpy
#print(bpy.context.active_object.mode)   # = 'OBJECT'
#bpy.ops.object.mode_set(mode='EDIT')
#print(bpy.context.active_object.mode)   # = 'EDIT'


#bpy.ops.text.run_script()
