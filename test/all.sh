#!/bin/bash
# -*- coding: utf-8, tab-width: 2 -*-


function test_all () {
  export LANG{,UAGE}=en_US.UTF-8  # make error messages search engine-friendly
  local SELFPATH="$(readlink -m "$BASH_SOURCE"/..)"
  cd "$SELFPATH" || return $?
  local LOG=

  echo '? readme demo:'
  ##u
  nodejs -e "require('json-eq-pmb').cli({
    keys: ['license', '.directories.test'],
    })" ../package.json objdive/package.json || return 3
  ##r

  echo '? eq keys:'
  test_objdive "keys: ['license', '.directories.test']"
  case "$LOG" in
    'rv=0' ) ;;
    * ) echo "Unexpected output: '$LOG'"; return 3;;
  esac

  echo '? ne keys:'
  test_objdive "keys: 'name'"
  case "$LOG" in
    'objdive/package.json¦'*$'¶rv=4' ) ;;
    * ) echo "Unexpected output: '$LOG'"; return 3;;
  esac

  echo '? TSV:'
  MTHD=tsv test_objdive "keys: ['name', '.directories.test', 'private']"
  case "$LOG" in
    '../package.json¦"json-eq-pmb"¦"test"¦false¶'$(
      )'objdive/package.json¦"objdive"¦"test"¦false¶'$(
      )'rv=0' ) ;;
    * ) echo "Unexpected output: '$LOG'"; return 3;;
  esac

  echo '+OK all tests passed.'
  return 0
}


function test_objdive () {
  local JS="require('json-eq-pmb').${MTHD:-cli}({$1})"
  LOG="$(nodejs -e "$JS" ../ objdive/ 2>&1; echo rv=$?)"
  LOG="${LOG//$'\n'/¶}"
  LOG="${LOG//$'\t'/¦}"
}












[ "$1" == --lib ] && return 0; test_all "$@"; exit $?
