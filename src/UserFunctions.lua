local p = {}
local getArgs = require('Module:Arguments').getArgs

function p.main(frame)
  local args = getArgs(frame)
  local type = args['type'] or args[1] or ''
  -- 功能
  if type == 'username' then
    return username(frame)
  elseif type == 'usergroup' then
    return usergroup(frame)
  elseif type == 'iflogin' then
    return iflogin(frame)
  elseif type == '' then
    return "<span class=\"error\" data-userfunction=\"no-such-function\">'''UserFunctions脚本错误'''：未指定功能</span>"
  else
    return "<span class=\"error\" data-userfunction=\"no-such-function\">'''UserFunctions脚本错误'''：功能<u>" ..
      type .. '</u>不存在</span>'
  end
end

-- 用户名
function username()
  local html = mw.html.create()
  local resHtml = html:tag('span'):addClass('UserFunctions'):attr('data-type', 'username'):wikitext('用户名'):done()
  return tostring(resHtml)
end

function usergroup()
  local html = mw.html.create()
  local resHtml = html:tag('span'):addClass('UserFunctions'):attr('data-type', 'usergroup'):wikitext('用户组'):done()
  return tostring(resHtml)
end

function iflogin(frame)
  local args = getArgs(frame)
  local res = ''
  for key in pairs(args) do
    res = res .. args[key]
  end
  return res
end

return p
