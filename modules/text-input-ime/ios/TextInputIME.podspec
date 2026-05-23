require 'json'

package = JSON.parse(File.read(File.join(__dir__, '..', 'package.json')))

Pod::Spec.new do |s|
  s.name           = 'TextInputIME'
  s.version        = '0.0.0'
  s.summary        = 'TextInputIME native module'
  s.description    = 'Reference implementation of TextInputIME'
  s.author         = 'Cross-entropy AI'
  s.homepage       = 'https://cross-entropy.ai'
  s.platforms      = { :ios => '16.4' }
  s.source         = { git: 'https://github.com/cross-entropy-ai/rn-ime' }
  s.license        = { :type => 'MIT' }
  s.static_framework = true

  s.dependency 'ExpoModulesCore'

  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES',
  }

  s.source_files = "**/*.{h,m,mm,swift,hpp,cpp}"
end
