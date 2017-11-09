
<!--#echo json="package.json" key="name" underline="=" -->
json-eq-pmb
===========
<!--/#echo -->

<!--#echo json="package.json" key="description" -->
Assert deep strict equality for subsets of JSON files&#39; data.
<!--/#echo -->


Usage
-----

from [test/all.sh](test/all.sh):

<!--#include file="test/all.sh" start="  ##u" stop="  ##r"
  outdent="  " code="bash" -->
<!--#verbatim lncnt="5" -->
```bash
nodejs -e "require('json-eq-pmb').cli({
  keys: ['license', '.directories.test'],
  })" ../package.json objdive/package.json || return 3
```
<!--/include-->



<!--#toc stop="scan" -->



Known issues
------------

* Needs more/better tests and docs.




&nbsp;


License
-------
<!--#echo json="package.json" key=".license" -->
ISC
<!--/#echo -->
